const r=require('express').Router();
const c=require('./footfalllog.controller');
const auth=require('../../middlewares/auth.middleware');
const perm=require('../../middlewares/permission.middleware');

r.post('/',perm('FOOTFALL','add'),c.create);
module.exports=r;
