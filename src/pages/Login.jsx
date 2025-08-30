import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Scale, AlertCircle } from 'lucide-react';
import { login as loginApi } from '../apis/auth';
import InputField from '../components/InputField';
import Button from '../components/Button';

const Login = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  // Watch form values for validation states
  const watchedValues = watch();

  const onSubmit = useCallback(
    async (data) => {
      try {
        setLoading(true);
        const res = await loginApi(data);
        const response = res?.data || res;

        if (response.success) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));

          navigate('/admin', { replace: true });
        } else {
          setError('apiError', {
            type: 'manual',
            message: response.message || 'Login failed',
          });
        }
      } catch (error) {
        setError('apiError', {
          type: 'manual',
          message: error.response?.data?.message || 'Something went wrong!',
        });
      } finally {
        setLoading(false);
      }
    },
    [navigate, setError]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <Scale className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Judiciary Staff Management System</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <InputField
              id="username"
              label="Username"
              type="text"
              placeholder="Enter your username"
              register={register}
              error={errors.username}
              rules={{ required: 'Username is required' }}
              required={true}
              value={watchedValues.username}
            />

            {/* Password Field */}
            <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              register={register}
              error={errors.password}
              rules={{ required: 'Password is required' }}
              required={true}
              value={watchedValues.password}
              showPasswordToggle={true}
            />

            {/* API Error */}
            {errors.apiError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 font-medium">
                    {errors.apiError.message}
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              variant="primary"
              size="md"
              fullWidth={true}>
              Login
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Secure access to judiciary management tools
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
