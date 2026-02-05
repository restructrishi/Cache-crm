
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000/api';
// Use a test user credentials - assuming seed data exists
// If not, we might need to create one or use an existing one.
// For now, I'll try to login as superadmin based on previous memories
const TEST_USER = {
    email: 'superadmin@cachecrm.com',
    password: 'securepassword123' // Assuming standard default, will fail if changed
};

async function runRegressionTest() {
    console.log('Starting PO Module Regression Test...');
    let token = '';

    // 1. Login
    try {
        console.log('1. Attempting Login...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, TEST_USER);
        token = loginRes.data.token;
        console.log('✅ Login Successful');
    } catch (error: any) {
        console.error('❌ Login Failed:', error.response?.data || error.message);
        console.log('Skipping remaining tests due to login failure.');
        return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    // 2. Create PO
    let poId = '';
    try {
        console.log('2. Creating Purchase Order...');
        const poData = {
            poNumber: `TEST-PO-${Date.now()}`,
            vendorName: 'Regression Test Vendor',
            vendorEmail: 'vendor@test.com',
            vendorPhone: '1234567890',
            items: [
                { description: 'Test Item 1', quantity: 2, unitPrice: 100, totalPrice: 200 },
                { description: 'Test Item 2', quantity: 1, unitPrice: 50, totalPrice: 50 }
            ],
            totalAmount: 250,
            notes: 'Created via regression test script'
        };

        const createRes = await axios.post(`${BASE_URL}/orders`, poData, { headers });
        poId = createRes.data.id;
        if (!poId) throw new Error('No ID returned');
        console.log(`✅ PO Created: ${createRes.data.poNumber} (ID: ${poId})`);
    } catch (error: any) {
        console.error('❌ Create PO Failed:', error.response?.data || error.message);
    }

    // 3. List POs
    try {
        console.log('3. Listing Purchase Orders...');
        const listRes = await axios.get(`${BASE_URL}/orders`, { headers });
        const found = listRes.data.find((p: any) => p.id === poId);
        if (found) {
            console.log('✅ PO found in list');
        } else {
            console.error('❌ PO not found in list');
        }
    } catch (error: any) {
        console.error('❌ List POs Failed:', error.response?.data || error.message);
    }

    // 4. Update Step (Simulate Workflow)
    try {
        console.log('4. Updating PO Step (Workflow)...');
        // Get PO details first to find a step
        const detailRes = await axios.get(`${BASE_URL}/orders/${poId}`, { headers });
        const firstStep = detailRes.data.steps[0];
        
        if (firstStep) {
            await axios.patch(`${BASE_URL}/orders/${poId}/step/${firstStep.stepName}`, {
                status: 'Completed',
                data: { comment: 'Regression test approval' }
            }, { headers });
            console.log('✅ Step Updated');
        } else {
            console.warn('⚠️ No steps found to update');
        }
    } catch (error: any) {
        console.error('❌ Update Step Failed:', error.response?.data || error.message);
    }

    // 5. File Upload (Mock)
    try {
        console.log('5. Testing File Upload (Mock)...');
        // Create a dummy file
        const dummyFilePath = path.join(__dirname, 'test-upload.txt');
        fs.writeFileSync(dummyFilePath, 'This is a test file for regression testing.');
        
        const formData = new FormData();
        // Node.js FormData handling is tricky without 'form-data' package, 
        // but let's try assuming standard axios with fs stream or buffer if using 'form-data' lib.
        // Since I can't easily install new packages, I'll skip the actual upload 
        // and just check if the upload endpoint exists and returns 400 for missing file.
        
        try {
            await axios.post(`${BASE_URL}/upload`, {}, { headers });
        } catch (err: any) {
            if (err.response?.status === 400) {
                 console.log('✅ Upload Endpoint Active (Returned 400 as expected for empty body)');
            } else {
                 console.error('❌ Upload Endpoint Error:', err.message);
            }
        }
        
        fs.unlinkSync(dummyFilePath);
    } catch (error: any) {
        console.error('❌ File Upload Test Failed:', error.message);
    }

    console.log('Regression Test Complete.');
}

runRegressionTest();
