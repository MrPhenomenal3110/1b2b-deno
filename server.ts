import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "https://esm.sh/@aws-sdk/client-bedrock-runtime";

// Type definition for the request payload
interface RequestPayload {
  message: string;
}

// AWS Configuration
const AWS_CONFIG = {
  region: Deno.env.get("AWS_DEFAULT_REGION"),
  credentials: {
    accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID"),
    secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY"),
    sessionToken: Deno.env.get("AWS_SESSION_TOKEN"), // Optional for temporary credentials
  },
};

// Initialize the Bedrock client
const client = new BedrockRuntimeClient(AWS_CONFIG);

async function invokeModel(req: Request): Promise<Response> {
  try {
    // Parse the request body
    const payload: RequestPayload = await req.json();

    if (!payload.message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
      });
    }

    // Validate AWS credentials
    if (
      !AWS_CONFIG.credentials.accessKeyId ||
      !AWS_CONFIG.credentials.secretAccessKey
    ) {
      return new Response(
        JSON.stringify({
          error: "AWS credentials are not properly configured",
        }),
        { status: 500 }
      );
    }

    const systemPrompt = `
    # Advertisement Compliance Rules/Parameters
# Detailed Advertising Platform Parameters

## Facebook/Meta Ads

### Image Feed Ads
- Resolution Parameters:
  - Square: 1080 x 1080 pixels (recommended)
  - Landscape: 1200 x 628 pixels
  - Vertical: 1080 x 1350 pixels
  - Minimum width: 600 pixels
  - Aspect ratio tolerance: ±3%
- File Specifications:
  - Maximum file size: 30MB
  - Supported formats: JPG, PNG
  - Color space: RGB
  - Color profile: sRGB
  - Resolution: 72 dpi minimum
- Text Elements:
  - Primary text: 125 characters (recommended), 3000 maximum
  - Headline: 40 characters
  - Description: 30 characters
  - Link description: 30 characters
  - Text overlay: Maximum 20% of image area
- Creative Requirements:
  - Image compression: Minimal to none
  - Text clarity: Minimum 12pt font
  - Border requirements: None, but recommended for white backgrounds
  - Animation: Not supported
  - QR codes: Supported but must be clearly visible

### Video Feed Ads
- Video Specifications:
  - Length: 1-240 seconds
  - Maximum file size: 4GB
  - Minimum resolution: 1080 x 1080 pixels
  - Supported formats: MP4, MOV, GIF
  - Video codec: H.264 compression
  - Audio codec: AAC audio compression
  - Audio quality: Stereo, 128kbps+
- Frame Rate Requirements:
  - Minimum: 24fps
  - Maximum: 60fps
  - Recommended: 30fps
- Bitrate Guidelines:
  - Minimum bitrate: 1 Mbps
  - Recommended bitrate: 
    - 1080p: 8 Mbps
    - 720p: 4 Mbps
    - 480p: 2 Mbps
- Caption Requirements:
  - Format: SRT or XML
  - Maximum length: Same as video duration
  - Languages: Multiple supported
  - Positioning: Adjustable
  - Style: Customizable

### Stories Ads
- Technical Specifications:
  - Resolution: 1080 x 1920 pixels
  - Aspect ratio: 9:16 only
  - Maximum file size: 30MB for images, 4GB for videos
  - Length: 15 seconds maximum
- Interactive Elements:
  - Swipe-up links: Supported
  - Stickers: Platform-specific
  - Polls: Available
  - Location tags: Optional
  - Mentions: Supported
- Creative Guidelines:
  - Safe zone: 14% from top and bottom
  - Text safe area: 250 pixels from top and bottom
  - Interactive element placement: Bottom 20% of screen
  - Vertical viewing optimization required

### Carousel Ads
- Card Specifications:
  - Number of cards: 2-10
  - Image size: 1080 x 1080 pixels
  - Video length: 240 seconds maximum per card
  - Individual card file size: 30MB
- Card Components:
  - Headline per card: 40 characters
  - Description per card: 20 characters
  - Link per card: Unique URLs allowed
  - Image/video ratio: Can mix within carousel
- Overall Carousel Requirements:
  - Primary text: 125 characters
  - Total file size: 250MB maximum
  - Transition effects: Platform-controlled
  - Card order: Customizable or dynamic

## Google Ads

### Display Network Ads
- Standard Display Sizes:
  - Rectangle: 300x250, 336x280
  - Leaderboard: 728x90
  - Skyscraper: 160x600
  - Mobile: 320x50
  - Large Mobile: 320x100
- Responsive Display Ads:
  - Images:
    - Landscape: 1200x628
    - Square: 1200x1200
    - Logo size: 1200x1200
    - Maximum file size: 5MB
  - Headlines:
    - Short headline: 30 characters
    - Long headline: 90 characters
    - Number of headlines: Up to 5
  - Descriptions:
    - Short description: 90 characters
    - Long description: 90 characters
    - Number of descriptions: Up to 5

### Search Ads
- Text Components:
  - Headlines:
    - Number of headlines: 3
    - Characters per headline: 30
    - Required headlines: Minimum 3
    - Dynamic insertion: Supported
  - Descriptions:
    - Number of descriptions: 2
    - Characters per description: 90
    - Dynamic insertion: Supported
  - Display URL:
    - Base domain: Must match final URL
    - Path fields: 2 custom paths
    - Characters per path: 15
- Ad Extensions:
  - Sitelinks: Up to 8
  - Callouts: Up to 10
  - Structured snippets: Up to 10
  - Location extensions: Linked to GMB
  - Call extensions: Verified phone numbers
  - Price extensions: Up to 8 cards
  - App extensions: Linked to app store
  - Image extensions: Up to 8 images

### Video Ads
- In-stream Ads:
  - Length requirements:
    - Skippable: 12 seconds minimum
    - Non-skippable: 15-20 seconds
    - Bumper ads: 6 seconds
  - Technical specifications:
    - Resolution range: 426x240 to 3840x2160
    - Aspect ratio: 16:9 or 4:3
    - File size: 256GB maximum
    - Frame rate: 30fps recommended
  - Audio requirements:
    - Codec: AAC-LC
    - Channels: Stereo or Mono
    - Sample rate: 48 kHz
    - Bitrate: 128 kbps minimum
- Discovery Ads:
  - Thumbnail requirements:
    - Size: 1280x720
    - Format: 16:9 only
    - File size: 2MB maximum
  - Companion banner:
    - Size: 300x60
    - Required for desktop
- Campaign Parameters:
  - Targeting options:
    - Demographics
    - Topics
    - Placements
    - Keywords
    - Audiences
  - Bidding strategies:
    - CPV (Cost per view)
    - CPM (Cost per thousand impressions)
    - Target CPA (Cost per acquisition)

## Instagram

### Feed Posts
- Image Specifications:
  - Aspect ratios: 1.91:1 to 4:5
  - Minimum resolution: 1080 pixels wide
  - Maximum file size: 30MB
  - Supported formats: JPG, PNG
- Video Specifications:
  - Length: 3-60 seconds
  - Maximum file size: 4GB
  - Minimum resolution: 1080 pixels wide
  - Frame rate: 30fps recommended
  - Audio: Required
- Creative Elements:
  - Caption: 2,200 characters maximum
  - Hashtags: Up to 30
  - Location tagging: Optional
  - Account tagging: Up to 20 accounts
  - Shopping tags: Up to 5 products
- Creative Requirements:
  - Text overlay: Less than 20% of image
  - Boomerang support: Yes
  - Multiple image carousel: Up to 10 images

### Stories and Reels
- Technical Requirements:
  - Dimensions: 1080 x 1920 pixels
  - Aspect ratio: 9:16
  - Video length:
    - Stories: 15 seconds maximum
    - Reels: 60 seconds maximum
  - File size: 4GB maximum
- Interactive Elements:
  - Stickers: All native stickers supported
  - Polls: Yes
  - Questions: Yes
  - Countdown: Yes
  - Quiz: Yes
  - Slider: Yes
- Creative Guidelines:
  - Safe zones: 14% from top and bottom
  - Text safe area: 250 pixels from edges
  - Sound: Recommended
  - Vertical optimization required

## LinkedIn

### Sponsored Content
- Image Ads:
  - Size: 1200 x 627 pixels
  - Format: JPG, PNG
  - File size: 5MB maximum
  - Color space: RGB
  - Resolution: 72 dpi minimum
- Video Ads:
  - Length: 3-30 minutes
  - File size: 200MB maximum
  - Frame rate: 30fps
  - Audio: Required
  - Captions: Optional but recommended
- Text Components:
  - Intro text: 600 characters
  - Headline: 150 characters
  - Description: 70 characters
  - Custom CTA button: Predefined list
- Document Ads:
  - File types: PDF, PPTX
  - File size: 100MB maximum
  - Page count: No limit
  - Preview image: First page

### Message Ads
- Message Components:
  - Subject line: 60 characters
  - Message body: 1,500 characters
  - Custom footer: 1,000 characters
  - Link anchor text: 70 characters
- Banner Image:
  - Size: 300 x 250 pixels
  - Format: JPG, PNG
  - File size: 2MB maximum
- Other Elements:
  - Company name: 100 characters
  - CTA button text: 20 characters
  - Lead gen forms: Optional
  - Custom variables: Supported

## TikTok

### In-Feed Ads
- Video Requirements:
  - Length: 5-60 seconds
  - File size: 500MB maximum
  - Resolution: 720 x 1280 pixels minimum
  - Aspect ratio: 9:16 (vertical)
  - Bitrate: 516 kbps minimum
  - Frame rate: 24fps minimum
- Audio Specifications:
  - Format: AAC
  - Channels: Stereo preferred
  - Sample rate: 48 kHz
  - Quality: High quality required
- Text Elements:
  - Caption: 100 characters
  - Ad description: 100 characters
  - CTA text: Predefined options
  - Brand name: 20 characters
- Creative Requirements:
  - Music: Must have rights
  - Watermarks: Not recommended
  - Text overlay: Clear and legible
  - Brand safety: Family-friendly

### Spark Ads
- Original Post Requirements:
  - Account authorization required
  - Content ownership verification
  - Post age: Less than 30 days
- Engagement Features:
  - Comments: Can be disabled
  - Likes: Always enabled
  - Shares: Platform controlled
  - Sound: Required
- Performance Metrics:
  - View definition: 6 seconds
  - Engagement tracking available
  - Click attribution window: 7 days
  - View attribution window: 24 hours

## Twitter

### Image Ads
- Technical Specifications:
  - File size: 15MB maximum
  - Resolution: Minimum 600 x 335 pixels
  - Aspect ratios: 1:1, 1.91:1, 4:5
  - Formats: JPG, PNG, GIF
  - Animation: Supported for GIFs
- Text Components:
  - Tweet text: 280 characters
  - Website card title: 70 characters
  - Description: 50 characters
  - Card types: Single image, Carousel
- Media Requirements:
  - Image quality: High resolution
  - Text overlay: Allowed
  - Branding: Required
  - Multiple images: Up to 4 per tweet

### Video Ads
- Video Specifications:
  - Length: 2-120 seconds
  - File size: 1GB maximum
  - Resolution: 1280 x 720 pixels minimum
  - Aspect ratios: 1:1, 16:9
  - Format: MP4
  - Bitrate: 6.4 Mbps recommended
- Audio Requirements:
  - Codec: AAC
  - Stereo: Supported
  - Bitrate: 128 kbps minimum
  - Captions: Optional but recommended
- Campaign Settings:
  - Objective options:
    - Awareness
    - Consideration
    - Conversion
  - Bidding strategies:
    - Automatic
    - Target cost
    - Maximum bid

## Universal Campaign Settings

### Audience Targeting
- Demographics:
  - Age ranges: Platform-specific
  - Gender: All options
  - Location: Country, region, city
  - Language: Multiple selection
- Interest-Based:
  - Behaviors
  - Interests
  - Custom categories
  - Look-alike audiences
- Technical:
  - Device types
  - Operating systems
  - Connection types
  - Carriers

### Budget Controls
- Spending Limits:
  - Daily budget minimum/maximum
  - Lifetime budget options
  - Cost caps
  - Bid adjustments
- Schedule Settings:
  - Start/end dates
  - Dayparting options
  - Time zone selection
  - Frequency capping

### Brand Safety
- Content Restrictions:
  - Violence restrictions
  - Adult content filtering
  - Controversial topics
  - Political content
- Placement Controls:
  - Site exclusions
  - App exclusions
  - Category blocking
  - Inventory types

### Performance Metrics
- Engagement Metrics:
  - Click-through rate (CTR)
  - Engagement rate
  - View-through rate
  - Average watch time
- Cost Metrics:
  - Cost per click (CPC)
  - Cost per mile (CPM)
  - Cost per view (CPV)
  - Cost per engagement
- Conversion Metrics:
  - Conversion rate
  - Cost per acquisition
  - Return on ad spend
  - Value per conversion

### Creative Best Practices
- General Guidelines:
  - Clear call-to-action
  - Brand visibility
  - Text clarity
  - Mobile optimization
- Platform-Specific:
  - Native features usage
  - Interactive elements
  - Sound design
  - Motion guidelines

### Legal Requirements
- Disclaimer Requirements:
  - Industry-specific
  - Geographic requirements
  - Regulatory compliance
- Privacy Compliance:
  - GDPR requirements
  - CCPA compliance
  - Data collection disclosure
  - User consent requirements

- You are an AI assistant specialized in analyzing advertisement compliance across various digital platforms. Your role is to analyze the provided JSON input and ensure all elements comply with platform-specific advertising requirements.
    
    
    # Advertisement Compliance Checker

## Input Format
The JSON input will contain the following required fields:

[
    {
        "status": "success",
        "processed_count": 1,
        "successful_count": 1,
        "results": [
            {
                "file_info": {
                    "name": "upload_0b7ad14386541fdfdcc281c7fd662040.png",
                    "size": 1245158,
                    "type": "image/png",
                    "extension": ".png",
                    "dimensions": {
                        "width": 2880,
                        "height": 1800
                    }
                },
                "analysis": {
                    "status": "success",
                    "image_specs": {
                        "dimensions": {
                            "width": 2880,
                            "height": 1800
                        },
                        "format": "png",
                        "aspect_ratio": 1.6,
                        "size_category": "large"
                    },
                    "content": {
                        "visual_elements": {
                            "products": [],
                            "people": [
                                {
                                    "name": "Person",
                                    "confidence": 96.7255630493164,
                                    "position": {
                                        "x": 38,
                                        "y": 74,
                                        "width": 6,
                                        "height": 22
                                    },
                                    "size": 0.013457145985072305
                                }
                            ],
                            "background_elements": [
                                {
                                    "name": "File",
                                    "confidence": 99.99336242675781,
                                    "position": null,
                                    "size": 0
                                },
                                {
                                    "name": "Webpage",
                                    "confidence": 99.36215209960938,
                                    "position": null,
                                    "size": 0
                                },
                                {
                                    "name": "Face",
                                    "confidence": 85.82102966308594,
                                    "position": null,
                                    "size": 0
                                },
                                {
                                    "name": "Head",
                                    "confidence": 85.82102966308594,
                                    "position": null,
                                    "size": 0
                                }
                            ],
                            "branding": []
                        },
                        "text_content": {
                            "headline": [
                                {
                                    "text": "aqi.in/in/dashboard/india/karnataka/mysore",
                                    "position": {
                                        "x": 309,
                                        "y": 158,
                                        "width": 571,
                                        "height": 37
                                    },
                                    "confidence": 95.16490173339844,
                                    "font_size": 28
                                },
                                {
                                    "text": "Dashboard > India > Karnataka 7 Mysore",
                                    "position": {
                                        "x": 220,
                                        "y": 496,
                                        "width": 616,
                                        "height": 33
                                    },
                                    "confidence": 96.42604064941406,
                                    "font_size": 25
                                }
                            ],
                            "body_text": [
                                {
                                    "text": "Chrome",
                                    "position": {
                                        "x": 107,
                                        "y": 9,
                                        "width": 100,
                                        "height": 23
                                    },
                                    "confidence": 97.74805450439453,
                                    "font_size": 17
                                },
                                {
                                    "text": "View",
                                    "position": {
                                        "x": 420,
                                        "y": 9,
                                        "width": 60,
                                        "height": 25
                                    },
                                    "confidence": 98.95913696289062,
                                    "font_size": 18
                                },
                                {
                                    "text": "Profiles",
                                    "position": {
                                        "x": 824,
                                        "y": 9,
                                        "width": 91,
                                        "height": 23
                                    },
                                    "confidence": 98.11429595947266,
                                    "font_size": 17
                                },
                                {
                                    "text": "Window",
                                    "position": {
                                        "x": 1041,
                                        "y": 9,
                                        "width": 97,
                                        "height": 23
                                    },
                                    "confidence": 97.03697967529297,
                                    "font_size": 17
                                },
                                {
                                    "text": "File",
                                    "position": {
                                        "x": 250,
                                        "y": 11,
                                        "width": 40,
                                        "height": 21
                                    },
                                    "confidence": 99.95361328125,
                                    "font_size": 16
                                },
                                {
                                    "text": "Edit",
                                    "position": {
                                        "x": 334,
                                        "y": 11,
                                        "width": 46,
                                        "height": 21
                                    },
                                    "confidence": 99.7998046875,
                                    "font_size": 16
                                },
                                {
                                    "text": "Bookmarks",
                                    "position": {
                                        "x": 650,
                                        "y": 11,
                                        "width": 132,
                                        "height": 21
                                    },
                                    "confidence": 99.83702850341797,
                                    "font_size": 16
                                },
                                {
                                    "text": "Tab",
                                    "position": {
                                        "x": 956,
                                        "y": 11,
                                        "width": 42,
                                        "height": 21
                                    },
                                    "confidence": 99.6773452758789,
                                    "font_size": 16
                                },
                                {
                                    "text": "Help",
                                    "position": {
                                        "x": 1179,
                                        "y": 9,
                                        "width": 54,
                                        "height": 26
                                    },
                                    "confidence": 98.80809020996094,
                                    "font_size": 20
                                },
                                {
                                    "text": "History",
                                    "position": {
                                        "x": 520,
                                        "y": 11,
                                        "width": 86,
                                        "height": 25
                                    },
                                    "confidence": 99.00566864013672,
                                    "font_size": 18
                                },
                                {
                                    "text": "Mon Nov 18 1:54 PM",
                                    "position": {
                                        "x": 2580,
                                        "y": 11,
                                        "width": 260,
                                        "height": 23
                                    },
                                    "confidence": 91.12831115722656,
                                    "font_size": 17
                                },
                                {
                                    "text": "M",
                                    "position": {
                                        "x": 200,
                                        "y": 79,
                                        "width": 28,
                                        "height": 18
                                    },
                                    "confidence": 90.85562133789062,
                                    "font_size": 13
                                },
                                {
                                    "text": "Mysore Air Quality Index (AQ x",
                                    "position": {
                                        "x": 1675,
                                        "y": 76,
                                        "width": 376,
                                        "height": 26
                                    },
                                    "confidence": 95.11582946777344,
                                    "font_size": 20
                                },
                                {
                                    "text": "Temple Trees Fountain to SIS",
                                    "position": {
                                        "x": 722,
                                        "y": 76,
                                        "width": 325,
                                        "height": 26
                                    },
                                    "confidence": 99.06781005859375,
                                    "font_size": 20
                                },
                                {
                                    "text": "+",
                                    "position": {
                                        "x": 2104,
                                        "y": 77,
                                        "width": 19,
                                        "height": 23
                                    },
                                    "confidence": 97.1484146118164,
                                    "font_size": 17
                                },
                                {
                                    "text": "BITS",
                                    "position": {
                                        "x": 172,
                                        "y": 237,
                                        "width": 51,
                                        "height": 21
                                    },
                                    "confidence": 98.72642517089844,
                                    "font_size": 16
                                },
                                {
                                    "text": "Lights Off",
                                    "position": {
                                        "x": 2424,
                                        "y": 315,
                                        "width": 81,
                                        "height": 19
                                    },
                                    "confidence": 97.11416625976562,
                                    "font_size": 15
                                },
                                {
                                    "text": "AQ Standard",
                                    "position": {
                                        "x": 1811,
                                        "y": 320,
                                        "width": 109,
                                        "height": 18
                                    },
                                    "confidence": 97.91427612304688,
                                    "font_size": 13
                                },
                                {
                                    "text": "Preferred Language",
                                    "position": {
                                        "x": 2072,
                                        "y": 324,
                                        "width": 157,
                                        "height": 23
                                    },
                                    "confidence": 96.84089660644531,
                                    "font_size": 17
                                },
                                {
                                    "text": "Products",
                                    "position": {
                                        "x": 1338,
                                        "y": 343,
                                        "width": 123,
                                        "height": 26
                                    },
                                    "confidence": 97.1617660522461,
                                    "font_size": 20
                                },
                                {
                                    "text": "Resources",
                                    "position": {
                                        "x": 1538,
                                        "y": 343,
                                        "width": 151,
                                        "height": 26
                                    },
                                    "confidence": 97.501220703125,
                                    "font_size": 20
                                },
                                {
                                    "text": "Search any Location, City, State or Country",
                                    "position": {
                                        "x": 357,
                                        "y": 345,
                                        "width": 536,
                                        "height": 28
                                    },
                                    "confidence": 98.25809478759766,
                                    "font_size": 21
                                },
                                {
                                    "text": "Ranking",
                                    "position": {
                                        "x": 1148,
                                        "y": 345,
                                        "width": 107,
                                        "height": 28
                                    },
                                    "confidence": 99.44458770751953,
                                    "font_size": 21
                                },
                                {
                                    "text": "Login",
                                    "position": {
                                        "x": 2668,
                                        "y": 345,
                                        "width": 69,
                                        "height": 26
                                    },
                                    "confidence": 99.19664001464844,
                                    "font_size": 20
                                },
                                {
                                    "text": "English-IN",
                                    "position": {
                                        "x": 2134,
                                        "y": 359,
                                        "width": 142,
                                        "height": 32
                                    },
                                    "confidence": 99.05636596679688,
                                    "font_size": 24
                                },
                                {
                                    "text": "AQI",
                                    "position": {
                                        "x": 1872,
                                        "y": 360,
                                        "width": 51,
                                        "height": 30
                                    },
                                    "confidence": 98.49357604980469,
                                    "font_size": 22
                                },
                                {
                                    "text": "Weather",
                                    "position": {
                                        "x": 524,
                                        "y": 631,
                                        "width": 120,
                                        "height": 26
                                    },
                                    "confidence": 97.8038558959961,
                                    "font_size": 20
                                },
                                {
                                    "text": "AQI",
                                    "position": {
                                        "x": 1426,
                                        "y": 631,
                                        "width": 51,
                                        "height": 30
                                    },
                                    "confidence": 98.20689392089844,
                                    "font_size": 22
                                },
                                {
                                    "text": "PM2.5",
                                    "position": {
                                        "x": 1607,
                                        "y": 631,
                                        "width": 81,
                                        "height": 23
                                    },
                                    "confidence": 98.97358703613281,
                                    "font_size": 17
                                },
                                {
                                    "text": "PM10",
                                    "position": {
                                        "x": 1804,
                                        "y": 631,
                                        "width": 76,
                                        "height": 25
                                    },
                                    "confidence": 97.79660034179688,
                                    "font_size": 18
                                },
                                {
                                    "text": "AQI",
                                    "position": {
                                        "x": 295,
                                        "y": 633,
                                        "width": 53,
                                        "height": 30
                                    },
                                    "confidence": 98.97757720947266,
                                    "font_size": 22
                                },
                                {
                                    "text": "SO2",
                                    "position": {
                                        "x": 2197,
                                        "y": 633,
                                        "width": 53,
                                        "height": 21
                                    },
                                    "confidence": 98.83065032958984,
                                    "font_size": 16
                                },
                                {
                                    "text": "NO2",
                                    "position": {
                                        "x": 2385,
                                        "y": 631,
                                        "width": 60,
                                        "height": 25
                                    },
                                    "confidence": 99.6204833984375,
                                    "font_size": 18
                                },
                                {
                                    "text": "03",
                                    "position": {
                                        "x": 2588,
                                        "y": 631,
                                        "width": 37,
                                        "height": 23
                                    },
                                    "confidence": 98.98827362060547,
                                    "font_size": 17
                                },
                                {
                                    "text": "LIVE",
                                    "position": {
                                        "x": 220,
                                        "y": 772,
                                        "width": 51,
                                        "height": 19
                                    },
                                    "confidence": 100,
                                    "font_size": 15
                                },
                                {
                                    "text": "Mysore Air Quality Index (AQI) I Air Pollution",
                                    "position": {
                                        "x": 165,
                                        "y": 823,
                                        "width": 987,
                                        "height": 53
                                    },
                                    "confidence": 98.90200805664062,
                                    "font_size": 40
                                },
                                {
                                    "text": "Locate me",
                                    "position": {
                                        "x": 2331,
                                        "y": 870,
                                        "width": 132,
                                        "height": 23
                                    },
                                    "confidence": 98.04590606689453,
                                    "font_size": 17
                                },
                                {
                                    "text": "Real-time PM2.5, PM10 air pollution level in India",
                                    "position": {
                                        "x": 165,
                                        "y": 904,
                                        "width": 895,
                                        "height": 40
                                    },
                                    "confidence": 99.03778839111328,
                                    "font_size": 30
                                },
                                {
                                    "text": "Last Updated: 2024-11-18 01:23:45 PM",
                                    "position": {
                                        "x": 165,
                                        "y": 969,
                                        "width": 574,
                                        "height": 37
                                    },
                                    "confidence": 99.33631134033203,
                                    "font_size": 28
                                },
                                {
                                    "text": "279",
                                    "position": {
                                        "x": 2554,
                                        "y": 1102,
                                        "width": 30,
                                        "height": 14
                                    },
                                    "confidence": 99.2538070678711,
                                    "font_size": 11
                                }
                            ],
                            "cta": [],
                            "disclaimers": []
                        },
                        "color_scheme": {
                            "dominant": "#181818",
                            "accent": [
                                "#ff191c",
                                "#1eff19"
                            ],
                            "background": "#111a19",
                            "contrast_ratio": 1
                        },
                        "composition_metrics": {
                            "text_coverage": 0.10183125766515914,
                            "visual_coverage": 0.013457145985072305,
                            "white_space": 0.8847115963497686,
                            "balance_score": 0.42857142857142855
                        }
                    }
                },
                "text_extraction": {
                    "primary_text": "Real-time PM2.5, PM10 air pollution level in India Last Updated: 2024-11-18 01:23:45 PM English-IN AQI AQI AQI Search any Location, City, State or Country Ranking Help Mysore Air Quality Index (AQ x Temple Trees Fountain to SIS Products Resources Login Weather View History PM10 NO2 Chrome Profiles Window Mon Nov 18 1:54 PM + Preferred Language PM2.5 03 Locate me File Edit Bookmarks Tab BITS SO2 Lights Off LIVE M AQ Standard 279",
                    "headline": "aqi.in/in/dashboard/india/karnataka/mysore Dashboard > India > Karnataka 7 Mysore",
                    "description": "Mysore Air Quality Index (AQI) I Air Pollution",
                    "call_to_action": ""
                }
            }
        ]
    },
    [],
    "platform": {
      "name": "Facebook",
      "placement": "Feed",
      "device_targeting": ["mobile", "desktop"],
      "objective": "Conversions"
    },
    "metadata": {
      "campaign_name": "Fair_And_Lovely",
      "target_audience": {
        "age_range": "0-100",
        "interests": ["Beauty", "Cosmetics", "Makeup", "Skin-Care"],
        "location": "India"
      },
      "tracking": {
        "utm_source": "facebook",
        "utm_medium": "paid_social",
        "utm_campaign": "fair_and_lovely"
      }
    }
]



## Analysis Requirements

1. Platform Validation
   - Verify if the specified platform is supported
   - Check if the ad format is appropriate for the platform
   - Confirm if the content type is allowed

2. Technical Compliance
   - Image/Video dimensions and aspect ratio
   - File size limitations
   - Format compatibility
   - Resolution requirements
   - Frame rate (for video content)
   - Color space specifications

3. Content Analysis
   - Text length restrictions
   - Character limits for headlines/descriptions
   - Text overlay percentage
   - Safe zone requirements
   - Interactive elements placement
   - Brand safety guidelines

4. Creative Elements
   - Font size requirements
   - Logo placement rules
   - Call-to-action compatibility
   - Border and background specifications
   - Animation restrictions
   - Audio requirements (if applicable)

## Output Format
Provide a structured JSON response containing:
json
[{
    "compliance_status": "COMPLIANT/NON_COMPLIANT",
    "platform_specific_issues": [
        {
            "element": "Element with issue",
            "current_value": "Current implementation",
            "requirement": "Platform requirement",
            "severity": "HIGH/MEDIUM/LOW",
            "recommendation": "How to fix"
        }
    ],
    "general_recommendations": [
        "List of general improvements"
    ],
    "estimated_performance_impact": "HIGH/MEDIUM/LOW"
}]


## Special Instructions
1. Always check against the latest platform specifications
2. Prioritize issues by severity
3. Provide actionable recommendations
4. Consider platform-specific best practices
5. Flag any potential brand safety concerns
6. Include performance optimization suggestions

## Example Usage

expected output format:

json
{
    // Overall compliance status - either "COMPLIANT" or "NON_COMPLIANT"
    "compliance_status": "string",
    
    // Array of specific compliance issues found
    "platform_specific_issues": [
        {
            // The element or aspect that has an issue
            "element": "string",
            
            // Current implementation or value
            "current_value": "string",
            
            // The platform's requirement for this element
            "requirement": "string",
            
            // Severity level: "HIGH", "MEDIUM", or "LOW"
            "severity": "string",
            
            // Specific, actionable recommendation to fix the issue
            "recommendation": "string"
        }
    ],
    
    // Array of general recommendations for improvement
    "general_recommendations": [
        "string"
    ],
    
    // Overall impact on expected ad performance: "HIGH", "MEDIUM", or "LOW"
    "estimated_performance_impact": "string"
}
NOTE: "Only send one json object. No extra details or text. Just one JSON object as specified"
`;

    const input = {
      modelId: "anthropic.claude-3-sonnet-20240229-v1:0", // Updated to latest model ID
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        system: systemPrompt,
        messages: [{ role: "user", content: JSON.stringify(payload.message) }],
        max_tokens: 30000,
      }),
      contentType: "application/json",
    };

    const command = new InvokeModelCommand(input);
    const response = await client.send(command);

    // Parse the response
    const responseBody = new TextDecoder().decode(response.body);
    const responseData = JSON.parse(responseBody);

    console.log(responseData);

    // Return the response with proper headers
    return new Response(
      JSON.stringify(JSON.parse(responseData?.content[0]?.text)),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Adjust according to your CORS needs
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

// Handle CORS preflight requests
function handleOptions(req: Request): Response {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// Server setup
Deno.serve((req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return handleOptions(req);
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
    });
  }

  return invokeModel(req);
});
