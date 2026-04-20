const s=require('./footfalllog.service');
exports.create=async(req,res)=>{
  await s.create(req.body);
  res.json({ success:true });
};
