const { pool } = require('./config/db');
const bcrypt = require('bcrypt');

async function seed() {
  console.log('Starting database seed...');

  try {
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const contributorPassword = await bcrypt.hash('User@123', 10);

    await pool.query('DELETE FROM image_keywords');
    await pool.query('DELETE FROM downloads');
    await pool.query('DELETE FROM images');
    await pool.query('DELETE FROM subcategories');
    await pool.query('DELETE FROM categories');
    await pool.query('DELETE FROM users');

    console.log('Cleared existing data...');

    const usersResult = await pool.query(`
      INSERT INTO users (username, email, password_hash, role, first_name, last_name, is_active)
      VALUES 
        ('admin', 'admin@pngpoint.com', $1, 'admin', 'Super', 'Admin', true),
        ('contributor1', 'contributor1@pngpoint.com', $2, 'contributor', 'John', 'Doe', true),
        ('contributor2', 'contributor2@pngpoint.com', $2, 'contributor', 'Jane', 'Smith', true)
      RETURNING id, username, role
    `, [adminPassword, contributorPassword]);

    console.log('Created users:', usersResult.rows);
    const adminId = usersResult.rows[0].id;
    const contributor1Id = usersResult.rows[1].id;
    const contributor2Id = usersResult.rows[2].id;

    const categoriesResult = await pool.query(`
      INSERT INTO categories (name, slug, description, is_active)
      VALUES 
        ('Animals', 'animals', 'Transparent PNG images of various animals including pets, wildlife, and marine life', true),
        ('Nature', 'nature', 'Beautiful nature elements like trees, flowers, plants, and landscapes', true),
        ('People', 'people', 'PNG cutouts of people, silhouettes, and human figures', true),
        ('Objects', 'objects', 'Everyday objects, tools, gadgets, and items', true),
        ('Food & Drinks', 'food-drinks', 'Delicious food items and beverages with transparent backgrounds', true),
        ('Business', 'business', 'Business related graphics, icons, and illustrations', true),
        ('Technology', 'technology', 'Computers, phones, gadgets, and tech devices', true),
        ('Transportation', 'transportation', 'Cars, planes, ships, and other vehicles', true),
        ('Sports', 'sports', 'Sports equipment, athletes, and fitness items', true),
        ('Holidays', 'holidays', 'Seasonal and holiday themed PNG images', true)
      RETURNING id, name, slug
    `);

    console.log('Created categories:', categoriesResult.rows.length);

    const categoryMap = {};
    categoriesResult.rows.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });

    const subcategoriesResult = await pool.query(`
      INSERT INTO subcategories (category_id, name, slug, description, is_active)
      VALUES 
        ($1, 'Dogs', 'dogs', 'Cute dog PNG images', true),
        ($1, 'Cats', 'cats', 'Adorable cat PNG images', true),
        ($1, 'Birds', 'birds', 'Beautiful bird PNG images', true),
        ($1, 'Wild Animals', 'wild-animals', 'Wildlife and safari animals', true),
        ($2, 'Trees', 'trees', 'Tree and forest elements', true),
        ($2, 'Flowers', 'flowers', 'Floral and botanical images', true),
        ($2, 'Mountains', 'mountains', 'Mountain and landscape elements', true),
        ($3, 'Business People', 'business-people', 'Professional people images', true),
        ($3, 'Children', 'children', 'Kids and children images', true),
        ($4, 'Electronics', 'electronics', 'Electronic devices and gadgets', true),
        ($4, 'Furniture', 'furniture', 'Home and office furniture', true),
        ($5, 'Fruits', 'fruits', 'Fresh fruit images', true),
        ($5, 'Vegetables', 'vegetables', 'Fresh vegetable images', true),
        ($5, 'Beverages', 'beverages', 'Drinks and beverages', true),
        ($6, 'Charts', 'charts', 'Business charts and graphs', true),
        ($6, 'Money', 'money', 'Currency and financial images', true),
        ($7, 'Computers', 'computers', 'Computer and laptop images', true),
        ($7, 'Smartphones', 'smartphones', 'Mobile phone images', true),
        ($8, 'Cars', 'cars', 'Automobile and car images', true),
        ($8, 'Airplanes', 'airplanes', 'Aircraft and aviation images', true),
        ($9, 'Football', 'football', 'Soccer and football equipment', true),
        ($9, 'Basketball', 'basketball', 'Basketball equipment and players', true),
        ($10, 'Christmas', 'christmas', 'Christmas themed decorations', true),
        ($10, 'Halloween', 'halloween', 'Halloween themed images', true)
      RETURNING id, name, category_id
    `, [
      categoryMap['animals'],
      categoryMap['nature'],
      categoryMap['people'],
      categoryMap['objects'],
      categoryMap['food-drinks'],
      categoryMap['business'],
      categoryMap['technology'],
      categoryMap['transportation'],
      categoryMap['sports'],
      categoryMap['holidays']
    ]);

    console.log('Created subcategories:', subcategoriesResult.rows.length);

    const subcatMap = {};
    subcategoriesResult.rows.forEach(sub => {
      subcatMap[sub.name] = { id: sub.id, category_id: sub.category_id };
    });

    const sampleImages = [
      { title: 'Golden Retriever Dog', description: 'Beautiful golden retriever puppy with transparent background', subcat: 'Dogs', keywords: ['dog', 'puppy', 'golden retriever', 'pet', 'animal', 'cute'] },
      { title: 'Orange Tabby Cat', description: 'Adorable orange tabby cat sitting', subcat: 'Cats', keywords: ['cat', 'tabby', 'orange', 'pet', 'animal', 'cute', 'kitten'] },
      { title: 'Bald Eagle', description: 'Majestic bald eagle in flight', subcat: 'Birds', keywords: ['eagle', 'bird', 'flying', 'wildlife', 'american', 'majestic'] },
      { title: 'African Lion', description: 'Powerful male lion with full mane', subcat: 'Wild Animals', keywords: ['lion', 'wildlife', 'africa', 'safari', 'king', 'mane'] },
      { title: 'Oak Tree', description: 'Large oak tree with green leaves', subcat: 'Trees', keywords: ['tree', 'oak', 'nature', 'forest', 'green', 'leaves'] },
      { title: 'Red Rose', description: 'Beautiful red rose flower', subcat: 'Flowers', keywords: ['rose', 'flower', 'red', 'romantic', 'love', 'botanical'] },
      { title: 'Snowy Mountain Peak', description: 'Snow-capped mountain peak', subcat: 'Mountains', keywords: ['mountain', 'snow', 'peak', 'nature', 'landscape', 'alpine'] },
      { title: 'Business Man', description: 'Professional businessman in suit', subcat: 'Business People', keywords: ['business', 'man', 'suit', 'professional', 'corporate', 'office'] },
      { title: 'Happy Child', description: 'Smiling child playing', subcat: 'Children', keywords: ['child', 'kid', 'happy', 'playing', 'smile', 'cute'] },
      { title: 'Laptop Computer', description: 'Modern laptop computer', subcat: 'Computers', keywords: ['laptop', 'computer', 'technology', 'work', 'office', 'device'] },
      { title: 'iPhone Smartphone', description: 'Latest smartphone device', subcat: 'Smartphones', keywords: ['phone', 'smartphone', 'mobile', 'iphone', 'device', 'technology'] },
      { title: 'Fresh Red Apple', description: 'Shiny red apple fruit', subcat: 'Fruits', keywords: ['apple', 'fruit', 'red', 'fresh', 'healthy', 'food'] },
      { title: 'Fresh Tomatoes', description: 'Ripe red tomatoes', subcat: 'Vegetables', keywords: ['tomato', 'vegetable', 'red', 'fresh', 'healthy', 'food'] },
      { title: 'Coffee Cup', description: 'Hot coffee in ceramic cup', subcat: 'Beverages', keywords: ['coffee', 'cup', 'drink', 'hot', 'beverage', 'cafe'] },
      { title: 'Bar Chart', description: 'Colorful business bar chart', subcat: 'Charts', keywords: ['chart', 'graph', 'business', 'data', 'statistics', 'bar'] },
      { title: 'Dollar Bills', description: 'Stack of US dollar bills', subcat: 'Money', keywords: ['money', 'dollar', 'cash', 'currency', 'finance', 'wealth'] },
      { title: 'Sports Car', description: 'Red sports car', subcat: 'Cars', keywords: ['car', 'sports', 'red', 'fast', 'automobile', 'vehicle'] },
      { title: 'Commercial Airplane', description: 'Boeing commercial aircraft', subcat: 'Airplanes', keywords: ['airplane', 'plane', 'aircraft', 'flight', 'travel', 'boeing'] },
      { title: 'Soccer Ball', description: 'Classic black and white soccer ball', subcat: 'Football', keywords: ['soccer', 'football', 'ball', 'sports', 'game', 'FIFA'] },
      { title: 'Basketball', description: 'Orange basketball', subcat: 'Basketball', keywords: ['basketball', 'ball', 'orange', 'sports', 'NBA', 'game'] },
      { title: 'Christmas Tree', description: 'Decorated Christmas tree with ornaments', subcat: 'Christmas', keywords: ['christmas', 'tree', 'holiday', 'decoration', 'festive', 'winter'] },
      { title: 'Halloween Pumpkin', description: 'Carved jack-o-lantern pumpkin', subcat: 'Halloween', keywords: ['halloween', 'pumpkin', 'jack-o-lantern', 'spooky', 'orange', 'autumn'] },
      { title: 'Modern Sofa', description: 'Contemporary living room sofa', subcat: 'Furniture', keywords: ['sofa', 'couch', 'furniture', 'living room', 'modern', 'home'] },
      { title: 'Headphones', description: 'Wireless over-ear headphones', subcat: 'Electronics', keywords: ['headphones', 'audio', 'music', 'wireless', 'electronics', 'device'] },
    ];

    const statuses = ['approved', 'approved', 'approved', 'pending', 'approved'];
    const users = [adminId, contributor1Id, contributor2Id];

    for (let i = 0; i < sampleImages.length; i++) {
      const img = sampleImages[i];
      const subcat = subcatMap[img.subcat];
      const userId = users[i % users.length];
      const status = statuses[i % statuses.length];
      const slug = img.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      const imageResult = await pool.query(`
        INSERT INTO images (user_id, title, slug, description, file_path, thumbnail_path, file_size, width, height, format, category_id, subcategory_id, status, download_count, view_count, is_featured, approved_at, approved_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING id
      `, [
        userId,
        img.title,
        slug,
        img.description,
        `/uploads/images/${slug}.png`,
        `/uploads/thumbnails/${slug}_thumb.png`,
        Math.floor(Math.random() * 500000) + 50000,
        1920,
        1080,
        'png',
        subcat.category_id,
        subcat.id,
        status,
        Math.floor(Math.random() * 1000),
        Math.floor(Math.random() * 5000),
        i < 5,
        status === 'approved' ? new Date() : null,
        status === 'approved' ? adminId : null
      ]);

      for (const keyword of img.keywords) {
        await pool.query(`
          INSERT INTO image_keywords (image_id, keyword)
          VALUES ($1, $2)
        `, [imageResult.rows[0].id, keyword]);
      }
    }

    console.log('Created sample images:', sampleImages.length);

    console.log('\n=== SEED COMPLETED SUCCESSFULLY ===');
    console.log('\nLogin Credentials:');
    console.log('------------------');
    console.log('Admin:');
    console.log('  Email: admin@pngpoint.com');
    console.log('  Password: Admin@123');
    console.log('\nContributors:');
    console.log('  Email: contributor1@pngpoint.com');
    console.log('  Password: User@123');
    console.log('  Email: contributor2@pngpoint.com');
    console.log('  Password: User@123');

  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed();
