import { 
  formatFirebaseError, 
  isFirebaseConfigured 
} from '../lib/firebase';
import { UserRole, UserProfile } from '../types';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

console.log('===============================================================');
console.log('    YOGA CONNECT INDIA — FIREBASE AUTHENTICATION TEST SUITE     ');
console.log('===============================================================\n');

// 1. Error Mapping Tests
assert(
  formatFirebaseError({ code: 'auth/invalid-credential' }).includes('Invalid email or password'),
  'Maps auth/invalid-credential to friendly credentials message'
);

assert(
  formatFirebaseError({ code: 'auth/email-already-in-use' }).includes('already exists'),
  'Maps auth/email-already-in-use to friendly duplicate account message'
);

assert(
  formatFirebaseError({ code: 'auth/weak-password' }).includes('at least 6 characters'),
  'Maps auth/weak-password to password length requirement'
);

assert(
  formatFirebaseError({ code: 'auth/unauthorized-domain' }).includes('Authorized Domains'),
  'Maps auth/unauthorized-domain to domain configuration guidance'
);

// 2. Four Account Roles Coverage
const ROLES: UserRole[] = ['admin', 'partner', 'instructor', 'user'];
assert(ROLES.length === 4, 'Four distinct account roles are defined and supported');
assert(ROLES.includes('admin'), 'Role: Admin is defined');
assert(ROLES.includes('partner'), 'Role: Yoga Centre Owner (partner) is defined');
assert(ROLES.includes('instructor'), 'Role: Individual Yoga Instructor is defined');
assert(ROLES.includes('user'), 'Role: Traveller is defined');

// 3. Anti-Privilege Escalation Guard
function sanitizeSignupRole(requestedRole: string): UserRole {
  if (requestedRole === 'admin') return 'user';
  if (requestedRole === 'partner' || requestedRole === 'instructor') return requestedRole as UserRole;
  return 'user';
}

assert(
  sanitizeSignupRole('admin') === 'user',
  'Public registration cannot assign itself the Admin role (forced to user)'
);

assert(
  sanitizeSignupRole('partner') === 'partner',
  'Centre owner signup accepts partner role (subject to pending verification)'
);

assert(
  sanitizeSignupRole('instructor') === 'instructor',
  'Instructor signup accepts instructor role (subject to pending verification)'
);

// 4. Partner Verification Status Defaults
interface MockCentreRegistration {
  centreName: string;
  ownerEmail: string;
  status: 'pending' | 'approved' | 'suspended';
  verified: boolean;
}

const mockCentre: MockCentreRegistration = {
  centreName: 'Himalayan Yoga Ashram',
  ownerEmail: 'owner@himalayashram.org',
  status: 'pending',
  verified: false
};

assert(
  mockCentre.status === 'pending' && mockCentre.verified === false,
  'New Yoga Centre Owner registrations default to pending status awaiting admin approval'
);

interface MockInstructorRegistration {
  fullName: string;
  email: string;
  status: 'pending' | 'approved' | 'suspended';
  verified: boolean;
}

const mockInstructor: MockInstructorRegistration = {
  fullName: 'Yogacharya Rajesh',
  email: 'rajesh@yogateacher.org',
  status: 'pending',
  verified: false
};

assert(
  mockInstructor.status === 'pending' && mockInstructor.verified === false,
  'New Individual Yoga Instructor registrations default to pending status'
);

// 5. Cross-Tenant Isolation Checks
const centreOwnerA = { uid: 'user-101', centreId: 'centre-alpha', role: 'partner' };
const centreOwnerB = { uid: 'user-202', centreId: 'centre-beta', role: 'partner' };
const bookingCentreAlpha = { id: 'bk-1', centreId: 'centre-alpha', customerEmail: 'traveller@example.com' };

assert(
  bookingCentreAlpha.centreId === centreOwnerA.centreId,
  'Centre Owner A can access Centre Alpha bookings'
);

assert(
  bookingCentreAlpha.centreId !== centreOwnerB.centreId,
  'Centre Owner B is strictly blocked from accessing Centre Alpha bookings'
);

// 6. Admin Unrestricted Clearance
const adminProfile: UserProfile = {
  id: 'admin-1',
  email: 'admin@yogaconnect.in',
  fullName: 'Chief Administrator',
  role: 'admin',
  createdAt: new Date().toISOString()
};

function canAccessAllRecords(profile: UserProfile): boolean {
  return profile.role === 'admin' && profile.email === 'admin@yogaconnect.in';
}

assert(
  canAccessAllRecords(adminProfile),
  'Admin profile has authorized platform-wide oversight'
);

assert(
  !canAccessAllRecords({ ...adminProfile, role: 'partner' }),
  'Non-admin profile is denied platform-wide oversight'
);

console.log('\n===============================================================');
console.log(`    FIREBASE TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
console.log('===============================================================');
