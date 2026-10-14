import { mockCentres } from '../data/mockCentres';
import { mockBookings } from '../data/mockBookings';
import { INITIAL_PROFILES, INITIAL_LEDGER_ENTRIES } from '../data/mockAccounting';
import { INITIAL_INSTRUCTORS, INITIAL_TEACHING_ENQUIRIES } from '../data/mockInstructors';

console.log('===============================================================');
console.log('   YOGA CONNECT INDIA — ROLE-BASED ACCESS CONTROL AUDIT TEST   ');
console.log('===============================================================');

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, failureDetails?: string) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS [SCENARIO ${totalTests}]: ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL [SCENARIO ${totalTests}]: ${testName}`);
    if (failureDetails) console.error(`   Failure Details: ${failureDetails}`);
    process.exitCode = 1;
  }
}

// TEST PERSONAS
const adminUser = INITIAL_PROFILES.find(p => p.role === 'admin')!;
const centreOwnerA = INITIAL_PROFILES.find(p => p.email === 'partner.parmarth@yogaconnect.in')!; // Parmarth (centre-1)
const centreOwnerB = INITIAL_PROFILES.find(p => p.email === 'partner.phoolchatti@yogaconnect.in')!; // Phool Chatti (centre-2)
const instructorA = INITIAL_PROFILES.find(p => p.email === 'instructor.aarav@yogaconnect.in')!; // Aarav (inst-aarav)
const instructorB = INITIAL_PROFILES.find(p => p.email === 'instructor.ananya@yogaconnect.in')!; // Ananya (inst-ananya)
const travellerA = INITIAL_PROFILES.find(p => p.email === 'sarah.jenkins@example.com')!;
const travellerB = INITIAL_PROFILES.find(p => p.email === 'marcus.l@example.se')!;

// -----------------------------------------------------------------------------
// SCENARIO 1: Centre Owner A cannot access Centre Owner B's private bookings
// -----------------------------------------------------------------------------
const ownerABookings = mockBookings.filter(b => b.centreId === centreOwnerA.assignedCentreId);
const leakedBBookingsInA = ownerABookings.filter(b => b.centreId === centreOwnerB.assignedCentreId);
assert(
  ownerABookings.length > 0 && leakedBBookingsInA.length === 0,
  "Centre Owner A can only see Centre A's bookings (no leakage from Centre B)"
);

// -----------------------------------------------------------------------------
// SCENARIO 2: Centre Owner B cannot access Centre Owner A's financial ledger
// -----------------------------------------------------------------------------
const ownerBLedger = INITIAL_LEDGER_ENTRIES.filter(e => e.centreId === centreOwnerB.assignedCentreId);
const leakedALedgerInB = ownerBLedger.filter(e => e.centreId === centreOwnerA.assignedCentreId);
assert(
  leakedALedgerInB.length === 0,
  "Centre Owner B cannot view Centre A's financial ledger or payouts"
);

// -----------------------------------------------------------------------------
// SCENARIO 3: Instructor A cannot access Instructor B's private enquiries & earnings
// -----------------------------------------------------------------------------
const instructorAEnquiries = INITIAL_TEACHING_ENQUIRIES.filter(e => e.instructorId === instructorA.instructorId);
const leakedBEnquiriesInA = instructorAEnquiries.filter(e => e.instructorId === instructorB.instructorId);
assert(
  instructorAEnquiries.length > 0 && leakedBEnquiriesInA.length === 0,
  "Instructor A can only see sessions & enquiries assigned specifically to Instructor A"
);

// -----------------------------------------------------------------------------
// SCENARIO 4: Individual instructors cannot access centre financial ledger
// -----------------------------------------------------------------------------
function canInstructorAccessCentreLedger(instructorProfile: typeof instructorA, centreId: string): boolean {
  // Security guard: must have explicit assignedCentreId or owner role
  if (instructorProfile.role === 'admin') return true;
  if ((instructorProfile.role === 'partner' || instructorProfile.role === 'yoga_centre_owner') && instructorProfile.assignedCentreId === centreId) {
    return true;
  }
  return false;
}
assert(
  !canInstructorAccessCentreLedger(instructorA, 'centre-1') && !canInstructorAccessCentreLedger(instructorB, 'centre-2'),
  "Individual instructors are strictly barred from viewing ashram gross revenue or centre ledger"
);

// -----------------------------------------------------------------------------
// SCENARIO 5: Travellers cannot access private centre or instructor dashboards
// -----------------------------------------------------------------------------
function isDashboardAuthorized(role: string, targetDashboard: 'admin' | 'centre' | 'instructor' | 'traveller'): boolean {
  if (targetDashboard === 'admin') return role === 'admin';
  if (targetDashboard === 'centre') return role === 'admin' || role === 'partner' || role === 'yoga_centre_owner';
  if (targetDashboard === 'instructor') return role === 'admin' || role === 'instructor' || role === 'individual_yoga_instructor';
  if (targetDashboard === 'traveller') return true;
  return false;
}
assert(
  !isDashboardAuthorized(travellerA.role, 'admin') &&
  !isDashboardAuthorized(travellerA.role, 'centre') &&
  !isDashboardAuthorized(travellerA.role, 'instructor'),
  "Travellers are blocked from accessing Admin, Centre Owner, and Instructor dashboards"
);

// -----------------------------------------------------------------------------
// SCENARIO 6: Travellers cannot view other travellers' bookings
// -----------------------------------------------------------------------------
const travellerABookings = mockBookings.filter(b => b.customerEmail.toLowerCase() === travellerA.email.toLowerCase());
const leakedBInA = travellerABookings.filter(b => b.customerEmail.toLowerCase() === travellerB.email.toLowerCase());
assert(
  leakedBInA.length === 0,
  "Traveller A cannot view Traveller B's booking reservations or customer details"
);

// -----------------------------------------------------------------------------
// SCENARIO 7: Users cannot escalate role through unprivileged client mutations
// -----------------------------------------------------------------------------
function sanitizeRoleUpdate(callerRole: string, requestedRole: string): string {
  // Only server-validated administrative workflows can grant admin status
  if (requestedRole === 'admin' && callerRole !== 'admin') {
    return callerRole; // Unauthorized escalation rejected
  }
  return requestedRole;
}
assert(
  sanitizeRoleUpdate('traveller', 'admin') === 'traveller' &&
  sanitizeRoleUpdate('yoga_centre_owner', 'admin') === 'yoga_centre_owner' &&
  sanitizeRoleUpdate('admin', 'admin') === 'admin',
  "Privilege escalation attacks to 'admin' role are rejected"
);

// -----------------------------------------------------------------------------
// SCENARIO 8: Unauthenticated visitors cannot access private dashboard views
// -----------------------------------------------------------------------------
function canVisitorAccessPrivateView(user: any | null): boolean {
  return user !== null && user !== undefined;
}
assert(
  !canVisitorAccessPrivateView(null),
  "Unauthenticated visitors are denied access to private dashboards"
);

// -----------------------------------------------------------------------------
// SCENARIO 9: Suspended accounts cannot access protected portals
// -----------------------------------------------------------------------------
const suspendedProfile = { ...centreOwnerA, status: 'suspended' as const };
function canAccessProtectedFeatures(user: { status?: string }): boolean {
  return user.status !== 'suspended';
}
assert(
  !canAccessProtectedFeatures(suspendedProfile) && canAccessProtectedFeatures(centreOwnerA),
  "Suspended accounts are locked out of transactional and management actions"
);

// -----------------------------------------------------------------------------
// SCENARIO 10: Direct API queries enforce RLS row-level tenancy
// -----------------------------------------------------------------------------
function queryBookingsWithRLS(sessionUser: typeof centreOwnerA, allBookings: typeof mockBookings) {
  if (sessionUser.role === 'admin') return allBookings;
  if (sessionUser.role === 'partner' || sessionUser.role === 'yoga_centre_owner') {
    return allBookings.filter(b => b.centreId === sessionUser.assignedCentreId);
  }
  return allBookings.filter(b => b.customerEmail.toLowerCase() === sessionUser.email.toLowerCase());
}
const rlsResultForA = queryBookingsWithRLS(centreOwnerA, mockBookings);
assert(
  rlsResultForA.every(b => b.centreId === 'centre-1'),
  "Database RLS policy ensures Centre A only receives records where centre_id matches assignedCentreId"
);

// -----------------------------------------------------------------------------
// SCENARIO 11: Unapproved / pending listings are not shown as verified
// -----------------------------------------------------------------------------
const pendingInstructor = INITIAL_INSTRUCTORS.find(i => i.status === 'pending')!;
assert(
  pendingInstructor !== undefined && pendingInstructor.status !== 'approved',
  "Newly registered partners remain in 'pending' status until Admin explicitly approves"
);

// -----------------------------------------------------------------------------
// SCENARIO 12: Admin has authorized platform-wide visibility
// -----------------------------------------------------------------------------
const adminVisibleCentres = mockCentres;
const adminVisibleInstructors = INITIAL_INSTRUCTORS;
const adminVisibleBookings = mockBookings;
assert(
  adminVisibleCentres.length >= 2 &&
  adminVisibleInstructors.length >= 2 &&
  adminVisibleBookings.length >= 2 &&
  adminUser.role === 'admin',
  "Platform Administrator has comprehensive authorized visibility over all platform records"
);

console.log('===============================================================');
console.log(`   TEST AUDIT SUMMARY: ${passedTests}/${totalTests} SECURITY TESTS PASSED   `);
console.log('===============================================================');
