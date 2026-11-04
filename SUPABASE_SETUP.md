# E-Office Supabase Integration Guide

## 📋 Overview

E-Office PT. Inti Mutiara Kreasindo sekarang terintegrasi dengan **Supabase** (PostgreSQL) untuk backend database dan autentikasi.

## 🏗️ Database Structure

### Tables

| Table | Description |
|-------|-------------|
| `profiles` | User profiles (extends auth.users) |
| `departments` | Department information |
| `letters` | Incoming/outgoing letters (surat masuk/keluar) |
| `dispositions` | Letter dispositions (disposisi surat) |
| `agendas` | Meeting schedules and events |
| `archives` | Digital document archives |
| `notifications` | User notifications |
| `activity_logs` | System activity tracking |

### Key Features

- ✅ **Row Level Security (RLS)** - Data isolation per user
- ✅ **Auto-updated timestamps** - Triggers for `updated_at`
- ✅ **Auto-profile creation** - Trigger on user signup
- ✅ **Activity logging** - Track all user actions
- ✅ **Notification system** - Real-time alerts

## 🚀 Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Name: `imk-eoffice`
   - Database Password: (save this securely)
   - Region: Singapore (or closest to your users)

### 2. Run Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Copy contents from `supabase/schema.sql`
3. Click "Run" to execute
4. Verify tables created in **Table Editor**

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Get your credentials from Supabase:
   - Go to **Project Settings** > **API**
   - Copy **Project URL** → `VITE_SUPABASE_URL`
   - Copy **anon/public key** → `VITE_SUPABASE_ANON_KEY`

3. Update `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 4. Create Demo Users

#### Option A: Via Supabase Dashboard (Recommended)

1. Go to **Authentication** > **Users**
2. Click "Add user" > "Create new user"
3. Fill in:
   - Email: `admin@imk.co.id`
   - Password: `admin123`
   - Auto Confirm User: ✅
4. Repeat for all demo users:

| Email | Password | Role | Department |
|-------|----------|------|------------|
| admin@imk.co.id | admin123 | admin | IT Management |
| manager@imk.co.id | manager123 | manager | Operations |
| staff@imk.co.id | staff123 | staff | Engineering |

#### Option B: Via SQL

Run this in SQL Editor (replace UUIDs):

```sql
-- First, create users via Authentication dashboard
-- Then run this to set their profiles

UPDATE public.profiles 
SET 
  full_name = 'Ahmad Wijaya',
  role = 'admin',
  department = 'IT Management',
  avatar = 'AW'
WHERE email = 'admin@imk.co.id';

UPDATE public.profiles 
SET 
  full_name = 'Siti Rahayu',
  role = 'manager',
  department = 'Operations',
  avatar = 'SR'
WHERE email = 'manager@imk.co.id';

UPDATE public.profiles 
SET 
  full_name = 'Budi Santoso',
  role = 'staff',
  department = 'Engineering',
  avatar = 'BS'
WHERE email = 'staff@imk.co.id';
```

### 5. Seed Sample Data (Optional)

Run this in SQL Editor to add sample data:

```sql
-- Sample Letters
INSERT INTO public.letters (letter_number, type, title, from_entity, letter_date, status, priority)
VALUES 
  ('001/SK/IMK/2024', 'incoming', 'Permintaan Proposal Proyek Digital Transformation', 'PT. Maju Bersama', '2024-01-15', 'received', 'high'),
  ('002/SK/IMK/2024', 'outgoing', 'Laporan Progress Proyek Bank Central', 'Tim Engineering', '2024-01-14', 'sent', 'normal'),
  ('003/SK/IMK/2024', 'incoming', 'Undangan Meeting Vendor Cloud Infrastructure', 'AWS Indonesia', '2024-01-13', 'received', 'normal');

-- Sample Agendas
INSERT INTO public.agendas (title, description, location, start_time, end_time, category)
VALUES 
  ('Weekly Team Standup', 'Sprint review dan planning', 'Meeting Room A', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 1 hour', 'meeting'),
  ('Client Presentation', 'Presentasi progress proyek', 'Online - Zoom', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 2 hours', 'meeting'),
  ('Project Deadline', 'Final delivery untuk Bank Central', 'Office', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days', 'deadline');

-- Sample Notifications
INSERT INTO public.notifications (user_id, title, message, type)
SELECT 
  id,
  'Selamat Datang di E-Office',
  'Anda telah berhasil login ke sistem E-Office PT. Inti Mutiara Kreasindo',
  'success'
FROM public.profiles
WHERE email = 'admin@imk.co.id';
```

### 6. Test Integration

1. Start development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/eoffice/login`

3. Login with demo credentials

4. Check console for:
   ```
   ✅ Supabase connected
   ```

5. Verify data loads from Supabase in dashboard

## 🔒 Security Features

### Row Level Security (RLS)

All tables have RLS enabled with policies:

- **profiles**: All users can read, users can only update their own
- **letters**: Authenticated users can read, creators can update
- **dispositions**: Only visible to sender and recipient
- **notifications**: Users can only see their own
- **activity_logs**: Read-only for audit purposes

### Authentication

- Uses Supabase Auth (JWT-based)
- Session stored in browser (httpOnly cookies)
- Automatic token refresh
- Protected routes redirect to login

## 📊 API Usage Examples

### Fetch Letters

```typescript
import { getLetters } from './lib/supabase-service';

// Get all letters
const letters = await getLetters();

// Get only incoming letters
const incoming = await getLetters('incoming');
```

### Create Disposition

```typescript
import { createDisposition } from './lib/supabase-service';

const disposition = await createDisposition({
  letter_id: 'letter-uuid',
  from_user_id: 'user-uuid-1',
  to_user_id: 'user-uuid-2',
  instruction: 'Mohon segera diproses',
  priority: 'high',
  status: 'pending',
});
```

### Get Dashboard Stats

```typescript
import { getDashboardStats } from './lib/supabase-service';

const stats = await getDashboardStats(userEmail);
// Returns: { incomingLetters, outgoingLetters, dispositions, todayAgendas }
```

## 🔄 Demo Mode

If Supabase is not configured (no `.env` file), the app automatically runs in **demo mode**:

- Authentication uses localStorage
- Mock data displayed in dashboard
- All features work without database

This is useful for:
- Development without Supabase setup
- Demo presentations
- Testing UI/UX

## 🐛 Troubleshooting

### "Supabase not configured" warning

- Check `.env` file exists
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart dev server after adding `.env`

### "Profile not found" error

- User exists in `auth.users` but not in `public.profiles`
- Run the profile update SQL (see Step 4)
- Check trigger `on_auth_user_created` is active

### RLS policy errors

- Verify RLS is enabled on all tables
- Check user is authenticated (not anonymous)
- Review policies in Supabase dashboard > Authentication > Policies

### Data not loading

- Check browser console for errors
- Verify table has data (check Table Editor)
- Test queries directly in SQL Editor

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🆘 Support

For technical support, contact:
- Email: engineering@intimutiara.co.id
- Internal: IT Management Department

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintained by**: PT. Inti Mutiara Kreasindo - IT Department
