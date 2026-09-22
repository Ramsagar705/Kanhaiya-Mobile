const Banner = require('../models/Banner');

const defaultSlides = [
  {
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1800&q=85',
    title: 'Upgrade to something brilliant',
    subtitle: 'Fresh arrivals, honest prices, and phones ready for your next chapter.',
    link: '/products/new',
  },
  {
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1800&q=85',
    title: 'Best deals on flagship phones',
    subtitle: 'Limited-time prices on carefully selected premium devices.',
    link: '/deals',
  },
  {
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1800&q=85',
    title: 'Certified second-hand phones',
    subtitle: 'Inspected devices with clear condition grades and dependable value.',
    link: '/products/used',
  },
  {
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1800&q=85',
    title: 'More phone. Less compromise.',
    subtitle: 'Find the right storage, camera, and battery for your everyday life.',
    link: '/products',
  },
  {
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1800&q=85',
    title: 'A smarter way to shop mobile',
    subtitle: 'Browse new and pre-owned phones from one trusted local store.',
    link: '/products',
  },
  {
    image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=1800&q=85',
    title: 'Your next phone is waiting',
    subtitle: 'Explore the latest collection from KANHAIYA MOBILE.',
    link: '/products/new',
  },
];

exports.getBanners = async (req, res) => {
  try {
    const banner = await Banner.findOne().sort('-updatedAt');
    res.json({ success: true, slides: banner?.slides?.length ? banner.slides : defaultSlides });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBanners = async (req, res) => {
  try {
    const slides = Array.isArray(req.body.slides)
      ? req.body.slides
          .map((slide) => ({
            image: String(slide.image || '').trim(),
            title: String(slide.title || '').trim(),
            subtitle: String(slide.subtitle || '').trim(),
            link: String(slide.link || '').trim(),
          }))
          .filter((slide) => slide.image)
          .slice(0, 6)
      : [];

    if (!slides.length) {
      return res.status(400).json({ message: 'At least one banner image is required' });
    }

    const banner = await Banner.findOneAndUpdate(
      {},
      { slides },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, slides: banner.slides });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.defaultSlides = defaultSlides;
