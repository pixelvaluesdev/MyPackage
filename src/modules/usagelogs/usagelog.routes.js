const r=require('express').Router();
const c=require('./usagelog.controller');
const auth=require('../../middlewares/auth.middleware');
const perm=require('../../middlewares/permission.middleware');

r.post('/',auth,perm('USAGELOG','add'),c.create);
module.exports=r;
