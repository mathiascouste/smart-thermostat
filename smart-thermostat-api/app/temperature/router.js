const router = require('express').Router();

const currentTemperature = (req, res) => {
    const currentTemperature = {
        value: 23,
        unit: 'celcius'
    }
    res.status(200).send(currentTemperature)
}

/**
 * Routes
 */
router.get('/now', currentTemperature);

module.exports = router;
