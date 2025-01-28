export interface Database {
  public: {
    Tables: {
      spots: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          capacity: number;
          price_per_hour: number;
          amenities: string[];
          features: {
            parking: boolean;
            wifi: boolean;
            accessibility: boolean;
            kitchen: boolean;
            sound_system: boolean;
            restrooms: boolean;
          };
          type: string;
          rules: string | null;
          status: string;
          featured_image: string | null;
          gallery_images: string[] | null;
          created_at: string;
          updated_at: string;
          square_footage: number | null;
        };
      };
    };
  };
}