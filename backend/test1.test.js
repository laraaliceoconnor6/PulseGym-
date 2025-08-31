
//3 unit tests
//name formatting, membership validation, one for max members 
const { formatMemberName, isValidMembership, maxMembersExceeded } = require('./backendHelpers');
const request = require('supertest');
const app = require('./server'); // your Express app



test('formatMemberName returns full name', () => {
    expect(formatMemberName('Alice', 'Smith')).toBe('Alice Smith');
});

test('formatMemberName returns null if missing values', () => {
    expect(formatMemberName('', 'Smith')).toBeNull();
});

test('isValidMembership returns true for valid type', () => {
    expect(isValidMembership('Premium')).toBe(true);
});

test('maxMembersExceeded works correctly', () => {
    expect(maxMembersExceeded(10, 10)).toBe(true);
    expect(maxMembersExceeded(5, 10)).toBe(false);
});



//integration test 
//Supertest
// //adding a member:
describe('Integration test for /members endpoint', () => {
    it('should add a member successfully', async () => {
        const res = await request(app)
            .post('/members')
            .send({
                first_name: 'Test',
                last_name: 'User',
                date_joined: '2025-08-31',
                membership_type: 'Premium',
                bank_account: '12345'
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Member added');
        expect(res.body.id).toBeDefined();
    });
});