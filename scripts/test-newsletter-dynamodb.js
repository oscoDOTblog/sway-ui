import { addSubscriber, getSubscriber, updateSubscriber, getActiveSubscribers, getSubscriberCount, deleteSubscriber } from '../src/lib/newsletterService.js';

// Test data
const testSubscribers = [
  {
    email: 'test1@example.com',
    firstName: 'John',
    lastName: 'Doe',
    source: 'sway-ui',
    tags: ['dance', 'newsletter'],
    preferences: {
      frequency: 'weekly',
      categories: ['dance', 'music']
    }
  },
  {
    email: 'test2@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    source: 'sway-ui',
    tags: ['music', 'newsletter'],
    preferences: {
      frequency: 'monthly',
      categories: ['music']
    }
  },
  {
    email: 'test3@example.com',
    source: 'external',
    tags: ['newsletter']
  }
];

async function runTests() {
  console.log('🧪 Starting DynamoDB Newsletter Service Tests...\n');

  try {
    // Test 1: Add subscribers
    console.log('📝 Test 1: Adding subscribers...');
    for (const subscriberData of testSubscribers) {
      const result = await addSubscriber(subscriberData);
      if (result.success) {
        console.log(`✅ Added: ${subscriberData.email}`);
      } else {
        console.log(`⚠️ Already exists: ${subscriberData.email}`);
      }
    }

    // Test 2: Get subscriber count
    console.log('\n📊 Test 2: Getting subscriber count...');
    const count = await getSubscriberCount();
    console.log(`Total subscribers: ${count}`);

    // Test 3: Get individual subscriber
    console.log('\n👤 Test 3: Getting individual subscriber...');
    const subscriber = await getSubscriber('test1@example.com');
    if (subscriber) {
      console.log(`✅ Found subscriber: ${subscriber.email}`);
      console.log(`   Name: ${subscriber.firstName} ${subscriber.lastName}`);
      console.log(`   Status: ${subscriber.status}`);
      console.log(`   Tags: ${subscriber.tags.join(', ')}`);
    } else {
      console.log('❌ Subscriber not found');
    }

    // Test 4: Update subscriber
    console.log('\n✏️ Test 4: Updating subscriber...');
    const updateResult = await updateSubscriber('test1@example.com', {
      firstName: 'Johnny',
      tags: ['dance', 'newsletter', 'vip']
    });
    if (updateResult.success) {
      console.log('✅ Subscriber updated successfully');
      console.log(`   New tags: ${updateResult.subscriber.tags.join(', ')}`);
    } else {
      console.log('❌ Failed to update subscriber');
    }

    // Test 5: Get active subscribers
    console.log('\n📋 Test 5: Getting active subscribers...');
    const activeResult = await getActiveSubscribers({ limit: 10 });
    console.log(`Active subscribers: ${activeResult.count}`);
    console.log('First few subscribers:');
    activeResult.subscribers.slice(0, 3).forEach(sub => {
      console.log(`   - ${sub.email} (${sub.status})`);
    });

    // Test 6: Clean up test data
    console.log('\n🧹 Test 6: Cleaning up test data...');
    for (const subscriberData of testSubscribers) {
      try {
        await deleteSubscriber(subscriberData.email);
        console.log(`✅ Deleted: ${subscriberData.email}`);
      } catch (error) {
        console.log(`⚠️ Could not delete: ${subscriberData.email} (${error.message})`);
      }
    }

    // Final count
    const finalCount = await getSubscriberCount();
    console.log(`\n📊 Final subscriber count: ${finalCount}`);

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('💥 Test failed:', error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests };
