const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || 'Something went wrong',
    data: null,
  });
};

export default errorHandler;
