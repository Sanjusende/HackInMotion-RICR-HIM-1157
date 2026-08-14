class ApiResponse {
  /**
   * Standardized Success Response
   */
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Standardized Error Response
   */
  static error(
    res,
    message = 'Internal Server Error',
    statusCode = 500,
    errorCode = 'INTERNAL_SERVER_ERROR',
    errors = []
  ) {
    let finalErrorCode = errorCode;
    let finalErrors = errors;

    if (Array.isArray(errorCode)) {
      finalErrors = errorCode;
      finalErrorCode = 'VALIDATION_ERROR';
    } else if (errorCode && typeof errorCode === 'object') {
      finalErrors = [errorCode];
      finalErrorCode = 'INTERNAL_SERVER_ERROR';
    }

    // Clean errors array to ensure only standard objects are returned
    const formattedErrors = Array.isArray(finalErrors)
      ? finalErrors.map((err) => {
          if (typeof err === 'string') return { message: err };
          return {
            field: err.path || err.param || undefined,
            message: err.msg || err.message || JSON.stringify(err),
          };
        })
      : [];

    return res.status(statusCode).json({
      success: false,
      message,
      errorCode: finalErrorCode,
      errors: formattedErrors,
    });
  }
}

export default ApiResponse;
