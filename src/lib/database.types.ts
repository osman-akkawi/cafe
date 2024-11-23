export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          description: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          description: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          description?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          description: string;
          price: string;
          image: string;
          category_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          description: string;
          price: string;
          image: string;
          category_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          description?: string;
          price?: string;
          image?: string;
          category_id?: string;
        };
      };
    };
  };
}