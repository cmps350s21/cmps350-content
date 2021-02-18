const express = require('express');
const router = express.Router();

const heroService = require('./services/HeroService');

router.route('/login')
    .post( heroService.login );

//Heroes Web API
router.route('/heroes')
    .get( heroService.getHeroes )
    .post( heroService.addHero );

router.route('/heroes/:id')
    .get( heroService.getHero )
    .put( heroService.updateHero )
    .delete( heroService.deleteHero );

module.exports = router;