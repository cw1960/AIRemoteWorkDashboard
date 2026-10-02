export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      card_events: {
        Row: {
          at: string;
          card_id: string;
          from_stage: Database["public"]["Enums"]["card_stage"] | null;
          id: number;
          source: Database["public"]["Enums"]["card_event_source"];
          to_stage: Database["public"]["Enums"]["card_stage"];
          user_id: string;
        };
        Insert: {
          at?: string;
          card_id: string;
          from_stage?: Database["public"]["Enums"]["card_stage"] | null;
          id?: never;
          source?: Database["public"]["Enums"]["card_event_source"];
          to_stage: Database["public"]["Enums"]["card_stage"];
          user_id: string;
        };
        Update: {
          at?: string;
          card_id?: string;
          from_stage?: Database["public"]["Enums"]["card_stage"] | null;
          id?: never;
          source?: Database["public"]["Enums"]["card_event_source"];
          to_stage?: Database["public"]["Enums"]["card_stage"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "card_events_card_id_fkey";
            columns: ["card_id"];
            isOneToOne: false;
            referencedRelation: "tracker_cards";
            referencedColumns: ["id"];
          },
        ];
      };
      email_prefs: {
        Row: {
          alerts_on: boolean;
          created_at: string;
          inbound_token: string;
          last_reminder_on: string | null;
          recap_on: boolean;
          reminders_on: boolean;
          unsubscribe_token: string;
          updated_at: string;
          user_id: string;
          welcomed_at: string | null;
        };
        Insert: {
          alerts_on?: boolean;
          created_at?: string;
          inbound_token?: string;
          last_reminder_on?: string | null;
          recap_on?: boolean;
          reminders_on?: boolean;
          unsubscribe_token?: string;
          updated_at?: string;
          user_id?: string;
          welcomed_at?: string | null;
        };
        Update: {
          alerts_on?: boolean;
          created_at?: string;
          inbound_token?: string;
          last_reminder_on?: string | null;
          recap_on?: boolean;
          reminders_on?: boolean;
          unsubscribe_token?: string;
          updated_at?: string;
          user_id?: string;
          welcomed_at?: string | null;
        };
        Relationships: [];
      };
      inbound_emails: {
        Row: {
          card_id: string | null;
          created_at: string;
          from_domain: string;
          id: string;
          matched_platform_id: string | null;
          matched_stage: Database["public"]["Enums"]["card_stage"] | null;
          received_at: string;
          status: Database["public"]["Enums"]["inbound_status"];
          subject: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          card_id?: string | null;
          created_at?: string;
          from_domain: string;
          id?: string;
          matched_platform_id?: string | null;
          matched_stage?: Database["public"]["Enums"]["card_stage"] | null;
          received_at?: string;
          status?: Database["public"]["Enums"]["inbound_status"];
          subject?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          card_id?: string | null;
          created_at?: string;
          from_domain?: string;
          id?: string;
          matched_platform_id?: string | null;
          matched_stage?: Database["public"]["Enums"]["card_stage"] | null;
          received_at?: string;
          status?: Database["public"]["Enums"]["inbound_status"];
          subject?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inbound_emails_card_id_fkey";
            columns: ["card_id"];
            isOneToOne: false;
            referencedRelation: "tracker_cards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inbound_emails_matched_platform_id_fkey";
            columns: ["matched_platform_id"];
            isOneToOne: false;
            referencedRelation: "platforms";
            referencedColumns: ["id"];
          },
        ];
      };
      ingest_runs: {
        Row: {
          closed: number;
          error: string | null;
          finished_at: string | null;
          found: number;
          id: number;
          inserted: number;
          platform_id: string;
          skipped: number;
          started_at: string;
          updated: number;
        };
        Insert: {
          closed?: number;
          error?: string | null;
          finished_at?: string | null;
          found?: number;
          id?: never;
          inserted?: number;
          platform_id: string;
          skipped?: number;
          started_at?: string;
          updated?: number;
        };
        Update: {
          closed?: number;
          error?: string | null;
          finished_at?: string | null;
          found?: number;
          id?: never;
          inserted?: number;
          platform_id?: string;
          skipped?: number;
          started_at?: string;
          updated?: number;
        };
        Relationships: [
          {
            foreignKeyName: "ingest_runs_platform_id_fkey";
            columns: ["platform_id"];
            isOneToOne: false;
            referencedRelation: "platforms";
            referencedColumns: ["id"];
          },
        ];
      };
      jobs: {
        Row: {
          closed_at: string | null;
          countries: string[];
          countries_blocked: string[];
          created_at: string;
          domain: string | null;
          external_id: string;
          first_seen_at: string;
          id: string;
          languages: string[];
          last_seen_at: string;
          pay_max: number | null;
          pay_min: number | null;
          pay_unit: Database["public"]["Enums"]["pay_unit"] | null;
          platform_id: string;
          posted_at: string | null;
          status: Database["public"]["Enums"]["job_status"];
          summary: string | null;
          tags: string[];
          title: string;
          updated_at: string;
          url: string;
        };
        Insert: {
          closed_at?: string | null;
          countries?: string[];
          countries_blocked?: string[];
          created_at?: string;
          domain?: string | null;
          external_id: string;
          first_seen_at?: string;
          id?: string;
          languages?: string[];
          last_seen_at?: string;
          pay_max?: number | null;
          pay_min?: number | null;
          pay_unit?: Database["public"]["Enums"]["pay_unit"] | null;
          platform_id: string;
          posted_at?: string | null;
          status?: Database["public"]["Enums"]["job_status"];
          summary?: string | null;
          tags?: string[];
          title: string;
          updated_at?: string;
          url: string;
        };
        Update: {
          closed_at?: string | null;
          countries?: string[];
          countries_blocked?: string[];
          created_at?: string;
          domain?: string | null;
          external_id?: string;
          first_seen_at?: string;
          id?: string;
          languages?: string[];
          last_seen_at?: string;
          pay_max?: number | null;
          pay_min?: number | null;
          pay_unit?: Database["public"]["Enums"]["pay_unit"] | null;
          platform_id?: string;
          posted_at?: string | null;
          status?: Database["public"]["Enums"]["job_status"];
          summary?: string | null;
          tags?: string[];
          title?: string;
          updated_at?: string;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "jobs_platform_id_fkey";
            columns: ["platform_id"];
            isOneToOne: false;
            referencedRelation: "platforms";
            referencedColumns: ["id"];
          },
        ];
      };
      outbound_clicks: {
        Row: {
          at: string;
          id: number;
          job_id: string;
          referrer_used: boolean;
          user_id: string | null;
        };
        Insert: {
          at?: string;
          id?: never;
          job_id: string;
          referrer_used: boolean;
          user_id?: string | null;
        };
        Update: {
          at?: string;
          id?: never;
          job_id?: string;
          referrer_used?: boolean;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "outbound_clicks_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          },
        ];
      };
      platform_memberships: {
        Row: {
          applied_at: string | null;
          created_at: string;
          id: string;
          notes: string | null;
          platform_id: string;
          reapply_after: string | null;
          status: Database["public"]["Enums"]["membership_status"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          applied_at?: string | null;
          created_at?: string;
          id?: string;
          notes?: string | null;
          platform_id: string;
          reapply_after?: string | null;
          status?: Database["public"]["Enums"]["membership_status"];
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          applied_at?: string | null;
          created_at?: string;
          id?: string;
          notes?: string | null;
          platform_id?: string;
          reapply_after?: string | null;
          status?: Database["public"]["Enums"]["membership_status"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "platform_memberships_platform_id_fkey";
            columns: ["platform_id"];
            isOneToOne: false;
            referencedRelation: "platforms";
            referencedColumns: ["id"];
          },
        ];
      };
      platforms: {
        Row: {
          countries_blocked: string[];
          created_at: string;
          email_domains: string[];
          id: string;
          name: string;
          onboarding_notes: string | null;
          referral_url_template: string | null;
          site_url: string;
          slug: string;
          updated_at: string;
        };
        Insert: {
          countries_blocked?: string[];
          created_at?: string;
          email_domains?: string[];
          id?: string;
          name: string;
          onboarding_notes?: string | null;
          referral_url_template?: string | null;
          site_url: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          countries_blocked?: string[];
          created_at?: string;
          email_domains?: string[];
          id?: string;
          name?: string;
          onboarding_notes?: string | null;
          referral_url_template?: string | null;
          site_url?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      playbooks: {
        Row: {
          checklist: NonNullable<Json>;
          created_at: string;
          id: string;
          next_step: string;
          platform_id: string;
          stage: Database["public"]["Enums"]["card_stage"];
          updated_at: string;
        };
        Insert: {
          checklist?: NonNullable<Json>;
          created_at?: string;
          id?: string;
          next_step: string;
          platform_id: string;
          stage: Database["public"]["Enums"]["card_stage"];
          updated_at?: string;
        };
        Update: {
          checklist?: NonNullable<Json>;
          created_at?: string;
          id?: string;
          next_step?: string;
          platform_id?: string;
          stage?: Database["public"]["Enums"]["card_stage"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "playbooks_platform_id_fkey";
            columns: ["platform_id"];
            isOneToOne: false;
            referencedRelation: "platforms";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          country: string | null;
          created_at: string;
          display_name: string | null;
          domains: string[];
          hours_per_week: number | null;
          languages: string[];
          locale: string;
          onboarded_at: string | null;
          skills: string[];
          target_rate: number | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          country?: string | null;
          created_at?: string;
          display_name?: string | null;
          domains?: string[];
          hours_per_week?: number | null;
          languages?: string[];
          locale?: string;
          onboarded_at?: string | null;
          skills?: string[];
          target_rate?: number | null;
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          country?: string | null;
          created_at?: string;
          display_name?: string | null;
          domains?: string[];
          hours_per_week?: number | null;
          languages?: string[];
          locale?: string;
          onboarded_at?: string | null;
          skills?: string[];
          target_rate?: number | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      saved_searches: {
        Row: {
          created_at: string;
          filters: NonNullable<Json>;
          frequency: Database["public"]["Enums"]["search_frequency"];
          id: string;
          last_sent_at: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          filters?: NonNullable<Json>;
          frequency?: Database["public"]["Enums"]["search_frequency"];
          id?: string;
          last_sent_at?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          filters?: NonNullable<Json>;
          frequency?: Database["public"]["Enums"]["search_frequency"];
          id?: string;
          last_sent_at?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      tracker_cards: {
        Row: {
          applied_at: string | null;
          created_at: string;
          id: string;
          job_id: string | null;
          kind: Database["public"]["Enums"]["card_kind"];
          next_action_at: string | null;
          notes: string | null;
          platform_id: string | null;
          position: number;
          stage: Database["public"]["Enums"]["card_stage"];
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          applied_at?: string | null;
          created_at?: string;
          id?: string;
          job_id?: string | null;
          kind: Database["public"]["Enums"]["card_kind"];
          next_action_at?: string | null;
          notes?: string | null;
          platform_id?: string | null;
          position?: number;
          stage?: Database["public"]["Enums"]["card_stage"];
          title: string;
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          applied_at?: string | null;
          created_at?: string;
          id?: string;
          job_id?: string | null;
          kind?: Database["public"]["Enums"]["card_kind"];
          next_action_at?: string | null;
          notes?: string | null;
          platform_id?: string | null;
          position?: number;
          stage?: Database["public"]["Enums"]["card_stage"];
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tracker_cards_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tracker_cards_platform_id_fkey";
            columns: ["platform_id"];
            isOneToOne: false;
            referencedRelation: "platforms";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      claim_welcome_email: {
        Args: Record<PropertyKey, never>;
        Returns: {
          email: string;
          locale: string;
          unsubscribe_token: string;
        }[];
      };
      due_job_alerts: {
        Args: { p_now: string; p_token: string };
        Returns: {
          email: string;
          filters: Json;
          frequency: Database["public"]["Enums"]["search_frequency"];
          jobs: Json;
          locale: string;
          platform_names: string[];
          search_id: string;
          total: number;
          unsubscribe_token: string;
          user_id: string;
        }[];
      };
      due_reminders: {
        Args: { p_day: string; p_token: string };
        Returns: {
          cards: Json;
          email: string;
          locale: string;
          unsubscribe_token: string;
          user_id: string;
        }[];
      };
      email_prefs_by_token: {
        Args: { p_token: string };
        Returns: {
          alerts_on: boolean;
          recap_on: boolean;
          reminders_on: boolean;
        }[];
      };
      feed_facets: { Args: Record<PropertyKey, never>; Returns: Json };
      ingest_jobs: {
        Args: {
          p_error?: string;
          p_jobs: Json;
          p_platform: string;
          p_skipped?: number;
          p_started_at: string;
        };
        Returns: Json;
      };
      log_outbound_click: { Args: { p_job_id: string }; Returns: boolean };
      mark_job_alerts_sent: {
        Args: { p_at: string; p_search_ids: string[]; p_token: string };
        Returns: undefined;
      };
      mark_reminder_sent: {
        Args: { p_day: string; p_token: string; p_user_id: string };
        Returns: undefined;
      };
      match_jobs: {
        Args: { p_job_ids?: string[]; p_limit?: number; p_user_id?: string };
        Returns: {
          country_ok: string;
          job_id: string;
          matched_domain: string;
          matched_languages: string[];
          pay_ok: boolean;
          score: number;
        }[];
      };
      set_app_url: { Args: { p_url: string }; Returns: undefined };
      set_email_prefs_by_token: {
        Args: {
          p_alerts_on?: boolean;
          p_recap_on?: boolean;
          p_reminders_on?: boolean;
          p_token: string;
        };
        Returns: boolean;
      };
      set_ingest_url: { Args: { p_url: string }; Returns: undefined };
      verify_ingest_token: { Args: { p_token: string }; Returns: boolean };
    };
    Enums: {
      card_event_source: "user" | "email";
      card_kind: "job" | "platform" | "manual";
      card_stage:
        | "saved"
        | "applied"
        | "assessment"
        | "interviewing"
        | "offered"
        | "rejected";
      inbound_status: "applied" | "needs_review" | "ignored";
      job_status: "open" | "closed";
      membership_status:
        "not_joined" | "applied" | "interviewing" | "active" | "rejected";
      pay_unit:
        | "hour"
        | "day"
        | "week"
        | "month"
        | "year"
        | "task"
        | "session"
        | "project";
      search_frequency: "daily" | "weekly";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      card_event_source: ["user", "email"],
      card_kind: ["job", "platform", "manual"],
      card_stage: [
        "saved",
        "applied",
        "assessment",
        "interviewing",
        "offered",
        "rejected",
      ],
      inbound_status: ["applied", "needs_review", "ignored"],
      job_status: ["open", "closed"],
      membership_status: [
        "not_joined",
        "applied",
        "interviewing",
        "active",
        "rejected",
      ],
      pay_unit: [
        "hour",
        "day",
        "week",
        "month",
        "year",
        "task",
        "session",
        "project",
      ],
      search_frequency: ["daily", "weekly"],
    },
  },
} as const;
