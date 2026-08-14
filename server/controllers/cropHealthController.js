import Farm from '../models/Farm.js';
import CropHealth from '../models/CropHealth.js';
import CommunityReport from '../models/CommunityReport.js';
import { evaluateCropHealth } from '../services/cropHealth/cropHealthEngine.js';
import PDFDocument from 'pdfkit';

const DEFAULT_LOCATION = {
  lat: 22.7196,
  lng: 75.8577,
};

const DEFAULT_CROP_IMAGE =
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80';

export const analyzeCropHealth = async (req, res) => {
  try {
    const { description } = req.body;

    const farm = await Farm.findOne({
      userId: req.user._id,
    });

    if (!farm) {
      return res.status(400).json({
        success: false,
        error: 'Farm profile required to record crop health observation.',
      });
    }

    let imageUrl = DEFAULT_CROP_IMAGE;

    if (req.file) {
      const base64Img = req.file.buffer.toString('base64');
      imageUrl = `data:${req.file.mimetype};base64,${base64Img}`;
    }

    const farmLocation = {
      lat: farm.location?.lat || DEFAULT_LOCATION.lat,
      lng: farm.location?.lng || DEFAULT_LOCATION.lng,
    };

    const observationDescription = description || 'Leaf observation report';

    const engineResult = await evaluateCropHealth(
      description || '',
      farm.currentCrop,
      req.file ? req.file.originalname : '',
      req.file ? req.file.buffer : null,
      req.file ? req.file.mimetype : ''
    );

    if (!engineResult.isValid) {
      return res.status(400).json({
        success: false,
        error: engineResult.message || 'Invalid crop image',
      });
    }

    const log = await CropHealth.create({
      farmId: farm._id,
      imageUrl,
      description: observationDescription,
      possibleIssue: engineResult.possibleIssue,
      confidence: `${engineResult.confidence}%`,
      whatToCheck: engineResult.whatToCheck,
      nextAction: engineResult.nextAction,
      location: farmLocation,
      reportedAt: new Date(),

      crop: engineResult.crop,
      health: engineResult.health,
      disease: engineResult.disease,
      severity: engineResult.severity,
      affectedArea: engineResult.affectedArea,
      causes: engineResult.causes,
      treatment: engineResult.treatment,
      prevention: engineResult.prevention,
      fertilizerRecommendation: engineResult.fertilizerRecommendation,
      irrigationRecommendation: engineResult.irrigationRecommendation,
      analysisTime: engineResult.analysisTime,
    });

    const hasIssue = !engineResult.possibleIssue.includes('Healthy');

    if (hasIssue) {
      await CommunityReport.create({
        crop: farm.currentCrop,
        possibleIssue: engineResult.possibleIssue,
        location: farmLocation,
        reportCount: 3,
        nearbyDistanceKm: 2.4,
        lastReportedAt: new Date(),
      });
    }

    return res.status(200).json({
      success: true,
      data: log,
      crop: engineResult.crop,
      health: engineResult.health,
      disease: engineResult.disease,
      confidence: `${engineResult.confidence}%`,
      severity: engineResult.severity,
      affectedArea: engineResult.affectedArea,
      causes: engineResult.causes,
      treatment: engineResult.treatment,
      prevention: engineResult.prevention,
      fertilizerRecommendation: engineResult.fertilizerRecommendation,
      irrigationRecommendation: engineResult.irrigationRecommendation,
      analysisTime: engineResult.analysisTime,
    });
  } catch (error) {
    console.error('Crop health analysis error:', error);

    return res.status(500).json({
      success: false,
      error: 'Analysis unavailable. Please retry or record observation manually.',
    });
  }
};

export const getCropHealthHistory = async (req, res) => {
  try {
    const farm = await Farm.findOne({
      userId: req.user._id,
    });

    if (!farm) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const history = await CropHealth.find({ farmId: farm._id }).sort({ reportedAt: -1 }).limit(20);

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error('Get crop health history error:', error);

    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve crop health history',
    });
  }
};

export const downloadCropHealthPdf = async (req, res) => {
  try {
    const report = await CropHealth.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=KrishiMitra_Report_${report._id}.pdf`);

    doc.pipe(res);

    // Document Title Header
    doc.fontSize(24).fillColor('#1b5e20').text('KrishiMitra AI Crop Diagnosis Report', { align: 'center' });
    doc.moveDown();

    doc.fontSize(10).fillColor('#424242').text(`Report ID: ${report._id}`, { align: 'right' });
    doc.text(`Generated At: ${new Date(report.reportedAt).toLocaleString()}`, { align: 'right' });
    doc.moveDown(1.5);

    // Section: Overview
    doc.fontSize(14).fillColor('#1b5e20').text('Crop Overview', { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(11).fillColor('#333333').text(`• Crop Name: ${report.crop}`);
    doc.text(`• Health Status: ${report.health}`);
    doc.text(`• Detected Disease: ${report.disease}`);
    doc.text(`• Diagnosis Confidence: ${report.confidence}`);
    doc.text(`• Severity Level: ${report.severity}`);
    doc.text(`• Affected Area Estimate: ${report.affectedArea}`);
    doc.moveDown();

    // Section: Symptoms and Causes
    doc.fontSize(14).fillColor('#1b5e20').text('Causes & Symptoms', { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(11).fillColor('#333333').text('Causes:');
    (report.causes || []).forEach((cause) => {
      doc.text(`  - ${cause}`);
    });
    doc.moveDown(0.5);

    // Section: Actions & Treatments
    doc.fontSize(14).fillColor('#1b5e20').text('Recommended Actions & Treatments', { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(11).fillColor('#333333').text('Treatment Plan:');
    (report.treatment || []).forEach((t) => {
      doc.text(`  - ${t}`);
    });
    doc.moveDown(0.5);

    doc.text('Prevention Strategy:');
    (report.prevention || []).forEach((p) => {
      doc.text(`  - ${p}`);
    });
    doc.moveDown();

    // Section: Telemetry recommendations
    doc.fontSize(14).fillColor('#1b5e20').text('Agronomic Telemetry Recommendations', { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(11).fillColor('#333333').text(`• Fertilizer Recommendation: ${report.fertilizerRecommendation}`);
    doc.text(`• Irrigation Recommendation: ${report.irrigationRecommendation}`);

    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ success: false, error: 'Could not generate PDF report' });
  }
};
