import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { NovaLogo } from '@/components/common/NovaLogo';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/services/api/auth.api';
import { extractErrorMessage } from '@/services/api/client';
import { getPostAuthRedirect } from '@/lib/auth';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const redirectTo = getPostAuthRedirect(
    (location.state as { from?: { pathname?: string; search?: string } } | null)?.from
  );

  useEffect(() => {
    if (isAuthenticated) navigate(redirectTo, { replace: true });
  }, [isAuthenticated, navigate, redirectTo]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormData) => {
    try {
      const result = await authApi.register({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      if (result.success) {
        // Auto-login after registration
        const loginResult = await authApi.login({ email: values.email, password: values.password });
        if (loginResult.success && loginResult.token && loginResult.user) {
          login(loginResult.token, loginResult.user);
          toast.success(`Welcome to NOVA Store, ${loginResult.user.name}!`);
          navigate(redirectTo, { replace: true });
        } else {
          toast.success('Account created! Please sign in.');
          navigate('/login');
        }
      } else {
        toast.error(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex justify-center">
          <Link to="/" aria-label="NOVA Store Home">
            <NovaLogo size="lg" />
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl shadow-black/40">
          <h1 className="mb-1 font-syne text-2xl font-bold text-foreground" style={{ fontFamily: "'Syne', sans-serif" }}>
            Create an account
          </h1>
          <p className="mb-7 text-sm text-muted-foreground">Join NOVA Store today</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="reg-name" className="mb-1.5 block text-sm font-medium text-foreground">
                Full name
              </label>
              <input
                id="reg-name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                {...register('name')}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
              {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium text-foreground">
                Email address
              </label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register('email')}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="mb-1.5 block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  {...register('password')}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirm-password" className="mb-1.5 block text-sm font-medium text-foreground">
                Confirm password
              </label>
              <input
                id="reg-confirm-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Repeat your password"
                {...register('confirmPassword')}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
