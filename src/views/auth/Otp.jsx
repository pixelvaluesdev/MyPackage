// project imports
import CommonAuthLayout from './CommonAuthLayout';
import AuthOpt from 'sections/auth/AuthOtp';

// ==============================|| Otp ||============================== //

export default function Otp() {
  return (
    <CommonAuthLayout title="Otp" subHeading="Enter the OTP sent to your registered email address.">
      {/* Otp form */}
      <AuthOpt />
    </CommonAuthLayout>
  );
}
