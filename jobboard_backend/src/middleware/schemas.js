const { z } = require('zod');

/** POST /api/jobs (admin) */
const createJobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.string().optional().default('Full-Time'),
  tags: z.array(z.string()).optional().default([]),
  is_featured: z.boolean().optional().default(false),
  deadline: z.string().optional().nullable(),
});

/** POST /api/applications */
const createApplicationSchema = z.object({
  job_id: z.number({ required_error: 'job_id is required' }).int().positive(),
});

/** POST /api/auth/login */
const loginSchema = z.object({
  email: z.string().email('Must be a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

/** POST /api/company/register */
const registerCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  email: z.string().email('Must be a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  logo_url: z.string().optional().nullable(),
  description: z.string().optional(),
  website: z.string().url().optional().nullable(),
  location: z.string().optional(),
});

/** POST /api/company/jobs */
const companyCreateJobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  location: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.string().optional().default('Full-Time'),
  tags: z.array(z.string()).optional().default([]),
  is_featured: z.boolean().optional().default(false),
  deadline: z.string().optional().nullable(),
});

/** PUT /api/company/jobs/:id */
const companyUpdateJobSchema = z.object({
  title: z.string().min(1).optional(),
  location: z.string().optional(),
  category: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  type: z.string().optional(),
  tags: z.array(z.string()).optional(),
  is_featured: z.boolean().optional(),
  deadline: z.string().optional().nullable(),
});

/** PUT /api/company/profile */
const updateCompanyProfileSchema = z.object({
  logo_url: z.string().optional().nullable(),
  description: z.string().optional(),
  website: z.string().url().optional().nullable(),
  location: z.string().optional(),
});

/** PUT /api/company/applications/:id/status */
const updateApplicationStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'interviewing']),
  interview_date: z.string().optional(),
  interview_link: z.string().optional(),
  interview_notes: z.string().optional(),
});

/** POST /api/users/register */
const registerUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Must be a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/** PUT /api/users/profile */
const updateUserProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  avatar_url: z.string().optional().nullable(),
  cv_url: z.string().optional().nullable(),
});

module.exports = {
  createJobSchema,
  createApplicationSchema,
  loginSchema,
  registerCompanySchema,
  companyCreateJobSchema,
  companyUpdateJobSchema,
  updateCompanyProfileSchema,
  updateApplicationStatusSchema,
  registerUserSchema,
  updateUserProfileSchema,
};
