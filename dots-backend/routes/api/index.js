const express = require('express');
const router = express.Router();

router.get('/data/restaurant', (req, res, next) => {
    res.send('read all');
});

router.get('/data/restaurant/:_id', (req, res, next) => {
    res.send('read ' + req.params._id);
});

router.post('/data/restaurant', (req, res, next) => {
    res.send('create');
});

router.put('/data/restaurant/:_id', (req, res, next) => {
    res.send('update ' + req.params._id);
});

router.delete('/data/restaurant/:_id', (req, res, next) => {
    res.send('delete ' + req.params._id);
});

module.exports = router;