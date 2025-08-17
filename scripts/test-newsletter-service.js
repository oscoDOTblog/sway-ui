import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

console.log('🧪 Testing Newsletter Service Functions...\n');

// Test 1: Check environment variables
console.log('📋 Test 1: Environment Variables...');
const requiredVars = [
  'AWS_REGION',
  'AWS_ACCESS_KEY_ID', 
  'AWS_SECRET_ACCESS_KEY',
  'AWS_DYNAMODB_NEWS'
];

let allVarsPresent = true;
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${varName.includes('KEY') ? '***' : value}`);
  } else {
    console.log(`❌ ${varName}: Not set`);
    allVarsPresent = false;
  }
});

if (!allVarsPresent) {
  console.log('\n💡 Please set the missing environment variables in .env.local');
  process.exit(1);
}

// Test 2: Test import of newsletter service
console.log('\n📦 Test 2: Newsletter Service Import...');
try {
  const { addSubscriber, getSubscriber, updateSubscriber } = await import('../src/lib/newsletterService.js');
  console.log('✅ Newsletter service imported successfully');
  console.log('   - addSubscriber function available');
  console.log('   - getSubscriber function available');
  console.log('   - updateSubscriber function available');
} catch (error) {
  console.error('❌ Failed to import newsletter service:', error.message);
  process.exit(1);
}

// Test 3: Test AWS config import
console.log('\n⚙️ Test 3: AWS Config Import...');
try {
  const { NEWSLETTER_TABLE } = await import('../src/lib/aws-config.js');
  console.log(`✅ AWS config imported successfully`);
  console.log(`   - Newsletter table name: ${NEWSLETTER_TABLE}`);
} catch (error) {
  console.error('❌ Failed to import AWS config:', error.message);
  process.exit(1);
}

// Test 4: Test API route imports
console.log('\n🌐 Test 4: API Route Imports...');
try {
  // Test newsletter-signup route
  const signupRoute = await import('../src/app/api/newsletter-signup/route.js');
  console.log('✅ Newsletter signup route imported successfully');
  
  // Test newsletter route
  const newsletterRoute = await import('../src/app/api/newsletter/route.js');
  console.log('✅ Newsletter route imported successfully');
} catch (error) {
  console.error('❌ Failed to import API routes:', error.message);
  process.exit(1);
}

console.log('\n🎉 All import tests passed!');
console.log('\n📝 Next Steps:');
console.log('1. Ensure your AWS user has DynamoDB permissions');
console.log('2. Create the DynamoDB table using the CloudFormation template');
console.log('3. Run: npm run test:dynamodb');
console.log('4. Run: npm run test:newsletter');
console.log('5. Run: npm run migrate:newsletter');
