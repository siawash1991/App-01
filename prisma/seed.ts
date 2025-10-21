import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // System Books Content
  const books = [
    {
      category: 'book',
      title: 'عادت‌های اتمی',
      author: 'جیمز کلیر',
      description: `راهنمای عملی برای ساخت عادت‌های خوب و شکستن عادت‌های بد. این کتاب نشان می‌دهد چگونه تغییرات کوچک می‌توانند به نتایج شگفت‌انگیزی منجر شوند.

**نکات کلیدی:**
- قدرت تغییرات 1 درصدی
- چهار قانون تغییر رفتار
- استراتژی‌های عملی برای ماندگاری عادت‌ها
- چگونگی ساخت سیستم‌های موفقیت`,
      tags: JSON.stringify(['عادت', 'بهره‌وری', 'موفقیت', 'توسعه فردی']),
      difficulty: 'intermediate',
      estimatedDuration: 600,
      audioSummaryUrl: 'https://example.com/atomic-habits-summary.mp3',
      videoClipUrl: 'https://www.youtube.com/watch?v=U_nzqnXWvSo',
      youtubeEmbedId: 'U_nzqnXWvSo',
      isSystemContent: true,
      rating: 4.8,
    },
    {
      category: 'book',
      title: 'قدرت عادت',
      author: 'چارلز داهیگ',
      description: `کاوشی علمی در اینکه چرا عادت‌ها وجود دارند و چگونه می‌توانیم آنها را تغییر دهیم. این کتاب به شما کمک می‌کند تا الگوهای رفتاری خود را درک کرده و کنترل کنید.

**موضوعات:**
- چرخه عادت: نشانه، روتین، پاداش
- عادت‌های کلیدی و تأثیر آنها
- قدرت اراده و انضباط
- تغییر عادت‌های سازمانی`,
      tags: JSON.stringify(['عادت', 'روانشناسی', 'رفتار', 'علوم اعصاب']),
      difficulty: 'intermediate',
      estimatedDuration: 540,
      isSystemContent: true,
      rating: 4.6,
    },
    {
      category: 'book',
      title: 'تفکر سریع و کند',
      author: 'دانیل کانمن',
      description: `برنده جایزه نوبل، دانیل کانمن، دو سیستم تفکر را توضیح می‌دهد: سیستم 1 که سریع، شهودی و احساسی است، و سیستم 2 که کند، منطقی و عمدی است.

**بینش‌های کلیدی:**
- دو سیستم تفکر و نحوه کارکرد آنها
- سوگیری‌های شناختی و تصمیم‌گیری
- اقتصاد رفتاری و نظریه چشم‌انداز
- چگونگی بهبود تصمیم‌گیری`,
      tags: JSON.stringify(['روانشناسی', 'تفکر', 'تصمیم‌گیری', 'علوم شناختی']),
      difficulty: 'advanced',
      estimatedDuration: 720,
      isSystemContent: true,
      rating: 4.7,
    },
    {
      category: 'book',
      title: 'هنر ظریف بی‌خیالی',
      author: 'مارک منسون',
      description: `رویکردی متفاوت به زندگی بهتر: نه از طریق تلاش برای مثبت‌اندیشی، بلکه با یادگیری اینکه به چه چیزهایی اهمیت ندهیم.

**درس‌های اصلی:**
- انتخاب آگاهانه ارزش‌ها
- پذیرش محدودیت‌ها
- مسئولیت‌پذیری
- زندگی با هدف`,
      tags: JSON.stringify(['فلسفه', 'زندگی', 'خودشناسی', 'موفقیت']),
      difficulty: 'beginner',
      estimatedDuration: 320,
      isSystemContent: true,
      rating: 4.5,
    },
    {
      category: 'book',
      title: 'جرات نکردن',
      author: 'برنه براون',
      description: `تحقیقی قدرتمند درباره آسیب‌پذیری، شجاعت، اصالت و شرم. برنه براون نشان می‌دهد چگونه آسیب‌پذیری می‌تواند منبع قدرت باشد.`,
      tags: JSON.stringify(['روانشناسی', 'شجاعت', 'خودشناسی', 'رهبری']),
      difficulty: 'intermediate',
      estimatedDuration: 480,
      isSystemContent: true,
      rating: 4.7,
    },
  ];

  // System Podcasts Content
  const podcasts = [
    {
      category: 'podcast',
      title: 'Huberman Lab',
      author: 'Andrew Huberman',
      description: `پادکست علوم اعصاب و بیولوژی که به شما کمک می‌کند با استفاده از دانش علمی، سلامت، عملکرد و رفاه خود را بهبود بخشید.

**موضوعات:**
- علوم اعصاب و مغز
- بهینه‌سازی خواب
- تمرین و عملکرد
- سلامت روان`,
      tags: JSON.stringify(['علم', 'سلامت', 'مغز', 'عملکرد']),
      difficulty: 'intermediate',
      externalLink: 'https://hubermanlab.com',
      isSystemContent: true,
      rating: 4.9,
    },
    {
      category: 'podcast',
      title: 'The Tim Ferriss Show',
      author: 'Tim Ferriss',
      description: `مصاحبه با افراد برتر جهان در حوزه‌های مختلف برای کشف ابزارها، عادت‌ها و روتین‌های آنها.`,
      tags: JSON.stringify(['موفقیت', 'بهره‌وری', 'کسب‌وکار', 'زندگی']),
      difficulty: 'beginner',
      externalLink: 'https://tim.blog/podcast',
      isSystemContent: true,
      rating: 4.8,
    },
    {
      category: 'podcast',
      title: 'Hidden Brain',
      author: 'NPR',
      description: `کاوش در ناخودآگاه انسانی و نحوه تأثیر آن بر تصمیمات، رفتارها و روابط ما.`,
      tags: JSON.stringify(['روانشناسی', 'علوم اجتماعی', 'رفتار', 'تصمیم‌گیری']),
      difficulty: 'intermediate',
      externalLink: 'https://hiddenbrain.org',
      isSystemContent: true,
      rating: 4.7,
    },
  ];

  // System Documentaries Content
  const documentaries = [
    {
      category: 'documentary',
      title: 'The Social Dilemma',
      author: 'Netflix',
      description: `مستندی درباره تأثیرات خطرناک شبکه‌های اجتماعی بر جامعه و سلامت روان. کارشناسان سابق فناوری بزرگ هشدار می‌دهند.

**نکات کلیدی:**
- چگونه الگوریتم‌ها رفتار ما را تغییر می‌دهند
- اعتیاد به شبکه‌های اجتماعی
- تأثیر بر دموکراسی و قطبی‌سازی
- راه‌حل‌ها و پیشنهادات`,
      tags: JSON.stringify(['تکنولوژی', 'جامعه', 'سلامت روان', 'شبکه‌های اجتماعی']),
      difficulty: 'intermediate',
      estimatedDuration: 94,
      externalLink: 'https://www.netflix.com/title/81254224',
      youtubeEmbedId: 'uaaC57tcci0',
      isSystemContent: true,
      rating: 4.6,
    },
    {
      category: 'documentary',
      title: 'Planet Earth',
      author: 'BBC',
      description: `سفری خیره‌کننده به زیبایی‌های طبیعت و تنوع حیات‌وحش سیاره زمین. فیلمبرداری بی‌نظیر و روایت دیوید اتنبرو.`,
      tags: JSON.stringify(['طبیعت', 'علم', 'محیط زیست', 'حیات‌وحش']),
      difficulty: 'beginner',
      estimatedDuration: 550,
      isSystemContent: true,
      rating: 4.9,
    },
    {
      category: 'documentary',
      title: 'Free Solo',
      author: 'National Geographic',
      description: `مستند برنده اسکار درباره الکس هانولد و تلاش او برای صعود بدون طناب به El Capitan. درسی در مورد ترس، آماده‌سازی و تعهد.`,
      tags: JSON.stringify(['ورزش', 'انگیزشی', 'شجاعت', 'تمرکز']),
      difficulty: 'beginner',
      estimatedDuration: 100,
      youtubeEmbedId: 'urRVZ4SW7WU',
      isSystemContent: true,
      rating: 4.8,
    },
  ];

  // Create all system content
  console.log('📚 Creating system books...');
  for (const book of books) {
    await prisma.skillContent.create({ data: book });
  }

  console.log('🎧 Creating system podcasts...');
  for (const podcast of podcasts) {
    await prisma.skillContent.create({ data: podcast });
  }

  console.log('🎬 Creating system documentaries...');
  for (const documentary of documentaries) {
    await prisma.skillContent.create({ data: documentary });
  }

  console.log('✅ Seed completed successfully!');
  console.log(`Created ${books.length} books, ${podcasts.length} podcasts, ${documentaries.length} documentaries`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
