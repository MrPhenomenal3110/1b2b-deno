// platform_guidelines.ts

export const PlatformGuidelines = {
  META: {
    "Image Feed Ads": {
      resolution: {
        options: [
          {
            type: "Square",
            width: 1080,
            height: 1080,
            isRecommended: true,
          },
          {
            type: "Landscape",
            width: 1200,
            height: 628,
            isRecommended: false,
          },
          {
            type: "Vertical",
            width: 1080,
            height: 1350,
            isRecommended: false,
          },
        ],
        minimum_width: 600,
        aspect_ratio_tolerance: 0.03,
      },
      file: {
        max_size: 30, // MB
        formats: ["JPG", "PNG"],
        color_space: "RGB",
        color_profile: "sRGB",
        min_dpi: 72,
        compression: "minimal",
      },
      text: {
        primary: {
          recommended: 125,
          max: 3000,
        },
        headline: {
          max: 40,
        },
        description: {
          max: 30,
        },
        link_description: {
          max: 30,
        },
        overlay: {
          max_percentage: 20,
        },
        min_font_size: 12, // pt
      },
      creative: {
        border: {
          required: false,
          recommended_for: ["white backgrounds"],
        },
        qr_codes: {
          supported: true,
          requirements: ["clearly visible"],
        },
      },
    },
    "Stories Ads": {
      resolution: {
        width: 1080,
        height: 1920,
        aspect_ratio: "9:16",
      },
      file: {
        max_size: 30, // MB
      },
      safe_zones: {
        top_bottom_margin: 14, // percentage
        text_safe_area: 250, // pixels from top/bottom
      },
    },
    "Carousel Ads": {
      cards: {
        min: 2,
        max: 10,
        image: {
          width: 1080,
          height: 1080,
          max_size: 30, // MB
        },
      },
      text: {
        headline: {
          max: 40,
        },
        description: {
          max: 20,
        },
        primary: {
          max: 125,
        },
      },
    },
  },
  GOOGLE: {
    "Display Network Ads": {
      standard_sizes: {
        rectangle: [
          { width: 300, height: 250 },
          { width: 336, height: 280 },
        ],
        leaderboard: [{ width: 728, height: 90 }],
        skyscraper: [{ width: 160, height: 600 }],
        mobile: [
          { width: 320, height: 50 },
          { width: 320, height: 100 },
        ],
      },
      responsive: {
        images: {
          landscape: {
            width: 1200,
            height: 628,
          },
          square: {
            width: 1200,
            height: 1200,
          },
          logo: {
            width: 1200,
            height: 1200,
          },
          max_file_size: 5, // MB
        },
        text: {
          headlines: {
            short: {
              max_length: 30,
            },
            long: {
              max_length: 90,
            },
            max_count: 5,
          },
          descriptions: {
            short: {
              max_length: 90,
            },
            long: {
              max_length: 90,
            },
            max_count: 5,
          },
        },
      },
    },
    "Discovery Ads": {
      thumbnail: {
        size: {
          width: 1280,
          height: 720,
        },
        aspect_ratio: "16:9",
        max_file_size: 2, // MB
      },
      companion_banner: {
        size: {
          width: 300,
          height: 60,
        },
        required_for: ["desktop"],
      },
    },
  },
  INSTAGRAM: {
    "Feed Posts": {
      image: {
        aspect_ratios: {
          min: 1.91 / 1,
          max: 4 / 5,
        },
        min_width: 1080,
        max_file_size: 30, // MB
        formats: ["JPG", "PNG"],
      },
      text: {
        caption: {
          max: 2200,
        },
        hashtags: {
          max: 30,
        },
        account_tags: {
          max: 20,
        },
        shopping_tags: {
          max: 5,
        },
      },
      creative: {
        text_overlay_max: 20, // percentage
        carousel_max_images: 10,
      },
    },
    Stories: {
      resolution: {
        width: 1080,
        height: 1920,
        aspect_ratio: "9:16",
      },
      file: {
        max_file_size: 30, // MB
      },
      safe_zones: {
        margins: 14, // percentage
        text_safe_area: 250, // pixels from edges
      },
    },
  },
  LINKEDIN: {
    "Sponsored Content": {
      image: {
        size: {
          width: 1200,
          height: 627,
        },
        formats: ["JPG", "PNG"],
        max_file_size: 5, // MB
        color_space: "RGB",
        min_dpi: 72,
      },
      text: {
        intro: {
          max: 600,
        },
        headline: {
          max: 150,
        },
        description: {
          max: 70,
        },
      },
    },
    "Message Ads": {
      banner: {
        size: {
          width: 300,
          height: 250,
        },
        formats: ["JPG", "PNG"],
        max_file_size: 2, // MB
      },
    },
  },
  TWITTER: {
    "Image Ads": {
      image: {
        max_file_size: 15, // MB
        min_resolution: {
          width: 600,
          height: 335,
        },
        aspect_ratios: ["1:1", "1.91:1", "4:5"],
        formats: ["JPG", "PNG"],
      },
      text: {
        tweet: {
          max: 280,
        },
        website_card_title: {
          max: 70,
        },
        description: {
          max: 50,
        },
      },
      media: {
        multiple_images: {
          max: 4,
        },
      },
    },
  },
};

export type PlatformName = keyof typeof PlatformGuidelines;
export type AdType<T extends PlatformName> =
  keyof (typeof PlatformGuidelines)[T];
