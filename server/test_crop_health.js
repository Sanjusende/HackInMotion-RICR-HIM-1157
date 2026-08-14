import axios from 'axios';
import fs from 'fs';
import { Jimp } from 'jimp';

const BASE_URL = 'http://localhost:5000/api/v1';

// Helper to register user and obtain token
async function getAuthToken() {
  const email = `test_farmer_${Date.now()}@test.com`;
  const password = 'Password123!';

  // 1. Register User
  const regRes = await axios.post(`${BASE_URL}/auth/register`, {
    name: 'Test Farmer',
    email,
    password,
    phone: '9876543210',
  });

  const token = regRes.data.data.accessToken;

  // 2. Setup Farm Profile
  await axios.post(
    `${BASE_URL}/farms`,
    {
      name: 'Test Farm',
      currentCrop: 'Tomato',
      soilType: 'Black Soil',
      landSize: { value: 5, unit: 'acres' },
      location: {
        lat: 22.7196,
        lng: 75.8577,
        display: 'Indore, Madhya Pradesh',
      },
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return token;
}

// Generate valid test images with pixel values matching plant characteristics
async function generateTestImages() {
  // 1. scan_1.jpg: A green healthy leaf with high gradient
  const img1 = new Jimp({ width: 100, height: 100 });
  for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 100; x++) {
      const rVal = (Math.floor(x / 5) % 2 === 0) ? 90 : 30;
      const color = (rVal << 24) | (135 << 16) | (30 << 8) | 0xff;
      img1.setPixelColor(color, x, y);
    }
  }
  const buf1 = await img1.getBuffer('image/jpeg');
  fs.writeFileSync('scan_1.jpg', buf1);

  // 2. scan_2.jpg: A tomato leaf showing brown/yellow blight lesions (using non-skin classification color)
  const img2 = new Jimp({ width: 100, height: 100 });
  for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 100; x++) {
      const rVal = (Math.floor(x / 5) % 2 === 0) ? 90 : 30;
      const color = (rVal << 24) | (135 << 16) | (30 << 8) | 0xff;
      img2.setPixelColor(color, x, y);
    }
  }
  for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 35; x++) {
      img2.setPixelColor(0x8b642bff, x, y); // Corrected brownish yellow
    }
  }
  const buf2 = await img2.getBuffer('image/jpeg');
  fs.writeFileSync('scan_2.jpg', buf2);

  // 3. scan_3.jpg: A wheat rust yellow leaf
  const img3 = new Jimp({ width: 100, height: 100 });
  for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 100; x++) {
      const rVal = (Math.floor(x / 5) % 2 === 0) ? 90 : 30;
      const color = (rVal << 24) | (135 << 16) | (30 << 8) | 0xff;
      img3.setPixelColor(color, x, y);
    }
  }
  // Add yellow-rust rust pustules (e.g. 25% of leaf area)
  for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 25; x++) {
      img3.setPixelColor(0xb8860bff, x, y); // Dark golden rod
    }
  }
  const buf3 = await img3.getBuffer('image/jpeg');
  fs.writeFileSync('scan_3.jpg', buf3);

  // 4. scan_4.jpg: A non-crop selfie containing skin tones
  const img4 = new Jimp({ width: 100, height: 100, color: 0xe0ac69ff }); // Common skin tone hex color
  const buf4 = await img4.getBuffer('image/jpeg');
  fs.writeFileSync('scan_4.jpg', buf4);

  // 5. scan_5.jpg: A neutral metallic gray object (e.g. car body/phone)
  const img5 = new Jimp({ width: 100, height: 100, color: 0x808080ff }); // Solid gray
  const buf5 = await img5.getBuffer('image/jpeg');
  fs.writeFileSync('scan_5.jpg', buf5);

  // 6. scan_6.jpg: A pure white paper or solid blank background
  const img6 = new Jimp({ width: 100, height: 100, color: 0xffffffff }); // Solid white
  const buf6 = await img6.getBuffer('image/jpeg');
  fs.writeFileSync('scan_6.jpg', buf6);
}

async function uploadImage(token, filepath, description = '') {
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  let body = '';

  if (fs.existsSync(filepath)) {
    const fileContent = fs.readFileSync(filepath);
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="image"; filename="${filepath}"\r\n`;
    body += `Content-Type: image/jpeg\r\n\r\n`;
    // We concatenate binary content safely via Buffer
    const headerBuffer = Buffer.from(body, 'utf-8');
    const footerBuffer = Buffer.from(
      `\r\n--${boundary}\r\nContent-Disposition: form-data; name="description"\r\n\r\n${description}\r\n--${boundary}--\r\n`,
      'utf-8'
    );

    const payload = Buffer.concat([headerBuffer, fileContent, footerBuffer]);

    try {
      const res = await axios.post(`${BASE_URL}/crop-health/analyze`, payload, {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          Authorization: `Bearer ${token}`,
        },
      });
      return { status: res.status, data: res.data };
    } catch (err) {
      return {
        status: err.response?.status,
        error: err.response?.data?.error,
        message: err.response?.data?.message,
      };
    }
  }
}

async function run() {
  console.log('=== STARTING CROP HEALTH API VERIFICATION ===');
  try {
    const token = await getAuthToken();
    console.log('✅ Registered test user.');
    console.log('✅ Set up farm profile (Current Crop: Tomato).');

    console.log('\nGenerating real, color-specific JPEG images using Jimp...');
    await generateTestImages();
    console.log('Images generated successfully.');

    // Test Case 1: Healthy green leaf (will fallback to active crop: Tomato)
    console.log('\nTesting upload: [scan_1.jpg] "healthy green canopy check"');
    const res1 = await uploadImage(token, 'scan_1.jpg', 'healthy green canopy check');
    console.log(`  Status: ${res1.status}`);
    console.log(
      `  Result: success=${res1.data?.success}, crop=${res1.data?.crop}, health=${res1.data?.health}, disease=${res1.data?.disease}, confidence=${res1.data?.confidence}`
    );
    console.log(`  Severity: ${res1.data?.severity}, Affected Area: ${res1.data?.affectedArea}`);
    console.log(`  Treatment: ${JSON.stringify(res1.data?.treatment)}`);
    if (res1.status === 200 && res1.data?.health === 'Healthy') {
      console.log('  ✅ MATCHED expected success outcome.');
    } else {
      console.error('  ❌ FAILED expected success outcome.');
    }

    // Test Case 2: Diseased Tomato Leaf Blight
    console.log('\nTesting upload: [scan_2.jpg] "tomato plant observation with leaf blight"');
    const res2 = await uploadImage(
      token,
      'scan_2.jpg',
      'tomato plant observation with leaf blight'
    );
    console.log(`  Status: ${res2.status}`);
    console.log(
      `  Result: success=${res2.data?.success}, crop=${res2.data?.crop}, health=${res2.data?.health}, disease=${res2.data?.disease}, confidence=${res2.data?.confidence}`
    );
    console.log(`  Severity: ${res2.data?.severity}, Affected Area: ${res2.data?.affectedArea}`);
    console.log(`  Treatment: ${JSON.stringify(res2.data?.treatment)}`);
    if (
      res2.status === 200 &&
      res2.data?.health === 'Diseased' &&
      res2.data?.disease.includes('Blight')
    ) {
      console.log('  ✅ MATCHED expected success outcome.');
    } else {
      console.error('  ❌ FAILED expected success outcome.');
    }

    // Test Case 3: Diseased Wheat Yellow Rust (overridden by description keyword wheat rust)
    console.log('\nTesting upload: [scan_3.jpg] "wheat observation showing yellow rust"');
    const res3 = await uploadImage(token, 'scan_3.jpg', 'wheat observation showing yellow rust');
    console.log(`  Status: ${res3.status}`);
    console.log(
      `  Result: success=${res3.data?.success}, crop=${res3.data?.crop}, health=${res3.data?.health}, disease=${res3.data?.disease}, confidence=${res3.data?.confidence}`
    );
    console.log(`  Severity: ${res3.data?.severity}, Affected Area: ${res3.data?.affectedArea}`);
    console.log(`  Treatment: ${JSON.stringify(res3.data?.treatment)}`);
    if (
      res3.status === 200 &&
      res3.data?.crop === 'Wheat' &&
      res3.data?.disease === 'Yellow Rust'
    ) {
      console.log('  ✅ MATCHED expected success outcome.');
    } else {
      console.error('  ❌ FAILED expected success outcome.');
    }

    // Test Case 4: Non-crop image (Selfie containing skin) - Should be rejected
    console.log('\nTesting upload: [scan_4.jpg] "selfie of a farmer standing in front of crop"');
    const res4 = await uploadImage(
      token,
      'scan_4.jpg',
      'selfie of a farmer standing in front of crop'
    );
    console.log(`  Status: ${res4.status}`);
    console.log(`  Error: ${res4.error}`);
    if (res4.status === 400) {
      console.log('  ✅ MATCHED expected rejection outcome.');
    } else {
      console.error('  ❌ FAILED expected rejection outcome.');
    }

    // Test Case 5: Non-crop image (Metallic Gray Object) - Should be rejected
    console.log('\nTesting upload: [scan_5.jpg] "photo of metal car body"');
    const res5 = await uploadImage(token, 'scan_5.jpg', 'photo of metal car body');
    console.log(`  Status: ${res5.status}`);
    console.log(`  Error: ${res5.error}`);
    if (res5.status === 400) {
      console.log('  ✅ MATCHED expected rejection outcome.');
    } else {
      console.error('  ❌ FAILED expected rejection outcome.');
    }

    // Test Case 6: Blank image (Solid white paper) - Should be rejected
    console.log('\nTesting upload: [scan_6.jpg] "observation check"');
    const res6 = await uploadImage(token, 'scan_6.jpg', 'observation check');
    console.log(`  Status: ${res6.status}`);
    console.log(`  Error: ${res6.error}`);
    if (res6.status === 400) {
      console.log('  ✅ MATCHED expected rejection outcome.');
    } else {
      console.error('  ❌ FAILED expected rejection outcome.');
    }

    // Test Case 7: Voice Assistant validation for raw locale 'hi-IN'
    console.log('\nTesting voice query with locale "hi-IN"');
    try {
      const voiceRes = await axios.post(
        `${BASE_URL}/voice/query`,
        {
          query: 'mujhe paani kab dena chahiye',
          language: 'hi-IN',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(`  Status: ${voiceRes.status}`);
      console.log(
        `  Result: success=${voiceRes.data?.success}, intent=${voiceRes.data?.intent}, response=${voiceRes.data?.response}`
      );
      if (voiceRes.status === 200 && voiceRes.data?.success) {
        console.log('  ✅ MATCHED expected success outcome.');
      } else {
        console.error('  ❌ FAILED voice query test.');
      }
    } catch (voiceErr) {
      console.error('  ❌ FAILED voice query test:', voiceErr.response?.data || voiceErr.message);
    }

    // Clean up local JPEGs
    fs.unlinkSync('scan_1.jpg');
    fs.unlinkSync('scan_2.jpg');
    fs.unlinkSync('scan_3.jpg');
    fs.unlinkSync('scan_4.jpg');
    fs.unlinkSync('scan_5.jpg');
    fs.unlinkSync('scan_6.jpg');
  } catch (err) {
    console.error('Verification crashed:', err.response?.data || err.message);
  }
  console.log('\n=== CROP HEALTH API VERIFICATION COMPLETE ===');
}

run();
