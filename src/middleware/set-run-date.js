module.exports = (req, res, next) => {
  try {
    let runDate = req.get('x-run-date');

    if (!runDate || typeof runDate !== 'string') {
      runDate = '2018-04-06';
    }

    req.runDate = runDate;
    return next();
  } catch (e) {
    return next(new Error('Something wrong with setting the run date'));
  }
};
