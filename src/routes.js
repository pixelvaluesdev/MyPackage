const r=require('express').Router();

r.use('/logins', require('./modules/logins/auth.routes'));
r.use('/dashboard',require('./modules/dashboard/dashboard.routes'));
r.use('/profile',require('./modules/profile/profile.routes'));
r.use('/transactions', require('./modules/transactions/transaction.routes'));
r.use('/lockers',require('./modules/lockers/locker.routes'));
r.use('/customers',require('./modules/lockers_customer/customer.routes'));
r.use('/healthlogs',require('./modules/healthlogs/healthlog.routes'));
r.use('/pinglogs',require('./modules/pinglogs/pinglog.routes'));
r.use('/usagelogs',require('./modules/usagelogs/usagelog.routes'));
r.use('/footfalllogs',require('./modules/footfalllogs/footfalllog.routes'));
r.use('/users',require('./modules/users/user.routes'));
r.use('/states',require('./modules/state/state.routes'));
r.use('/city',require('./modules/city/city.routes'));
module.exports=r;