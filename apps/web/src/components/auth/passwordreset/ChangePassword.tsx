'use client';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { axiosInstance } from '@/libs/axios.config';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import * as Yup from 'yup';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import YupPassword from 'yup-password';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = () => {
  const { token } = useParams();
  const router = useRouter();

  YupPassword(Yup);
  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required('Password is required')
      .min(6, 'Password must have at least 6 characters')
      .minNumbers(1, 'Password must contain at least 1 number')
      .minUppercase(1, 'Password must contain at least 1 letter in uppercase'),
    confirmPassword: Yup.string()
      .required('Please confirm your new password')
      .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
  });

  const handleSubmit = async (values: any) => {
    try {
      await axiosInstance().post(
        '/api/users/verifyChangePassword',
        {
          token: token,
          newPassword: values.newPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      toast.success(
        'New password has been set. Please login with your new password.',
      );
      router.push('/auth/login/user');
    } catch (error) {
      console.log(error);
      toast.error('Error');
    }
  };

  return (
    <>
      <div className="">
        <div className="flex flex-col justify-center items-center h-screen">
          {/* HEADER SECTION */}
          <div className="mb-3 flex items-center justify-center flex-col">
            <Link href="/">
              <img
                src="https://i.ibb.co.com/QPvYKBk/1.png"
                alt=""
                className="w-24 "
              />
            </Link>
            <h2 className="font-bold">Set your password</h2>
            <div className="text-zinc-400">Must be at least 6 characters</div>
          </div>
          <center>
            <Formik
              initialValues={{
                newPassword: '',
                confirmPassword: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              className=""
            >
              {({ isSubmitting, isValid, dirty }) => (
                <Form>
                  <div className="form-floating mb-3">
                    <Field
                      type="password"
                      name="newPassword"
                      className="form-control"
                      id="newPassword"
                      placeholder="New Password"
                    />
                    <label htmlFor="newPassword">New password</label>
                    <ErrorMessage
                      name="newPassword"
                      component="div"
                      className="text-red-700 text-xs mt-2"
                    />
                  </div>
                  <div className="form-floating mb-3">
                    <Field
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      id="confirmPassword"
                      placeholder="Confirm Password"
                    />
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-700 text-xs mt-2"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn my-2 btn-dark w-full"
                    disabled={isSubmitting || !isValid || !dirty}
                  >
                    Reset password
                  </button>
                </Form>
              )}
            </Formik>
          </center>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ChangePassword;