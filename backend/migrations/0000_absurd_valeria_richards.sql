CREATE TYPE "public"."actor_kind" AS ENUM('system', 'admin', 'customer');--> statement-breakpoint
CREATE TYPE "public"."email_status" AS ENUM('pending', 'sent', 'failed', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."submission_kind" AS ENUM('contact', 'quote', 'career');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('new', 'in_progress', 'responded', 'closed', 'spam');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'owner');--> statement-breakpoint
CREATE TABLE "activity_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_kind" "submission_kind",
	"submission_id" uuid,
	"actor_kind" "actor_kind" DEFAULT 'system' NOT NULL,
	"actor_admin_id" uuid,
	"action" text NOT NULL,
	"detail" jsonb,
	"correlation_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_kind" "submission_kind" NOT NULL,
	"submission_id" uuid NOT NULL,
	"original_name" text NOT NULL,
	"stored_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"extension" text NOT NULL,
	"size_bytes" bigint NOT NULL,
	"uploaded_by_kind" text DEFAULT 'customer' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "career_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference" text NOT NULL,
	"status" "submission_status" DEFAULT 'new' NOT NULL,
	"internal_notes" text,
	"assigned_admin_id" uuid,
	"source_page" text,
	"ip_address" text,
	"user_agent" text,
	"correlation_id" text,
	"email_status" "email_status" DEFAULT 'pending' NOT NULL,
	"notified_at" timestamp with time zone,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"position" text NOT NULL,
	"experience" text NOT NULL,
	"portfolio_url" text,
	"cover_message" text NOT NULL,
	"consent" boolean DEFAULT false NOT NULL,
	CONSTRAINT "career_applications_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "contact_inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference" text NOT NULL,
	"status" "submission_status" DEFAULT 'new' NOT NULL,
	"internal_notes" text,
	"assigned_admin_id" uuid,
	"source_page" text,
	"ip_address" text,
	"user_agent" text,
	"correlation_id" text,
	"email_status" "email_status" DEFAULT 'pending' NOT NULL,
	"notified_at" timestamp with time zone,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"full_name" text NOT NULL,
	"company" text,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"consent" boolean DEFAULT false NOT NULL,
	CONSTRAINT "contact_inquiries_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "quote_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference" text NOT NULL,
	"status" "submission_status" DEFAULT 'new' NOT NULL,
	"internal_notes" text,
	"assigned_admin_id" uuid,
	"source_page" text,
	"ip_address" text,
	"user_agent" text,
	"correlation_id" text,
	"email_status" "email_status" DEFAULT 'pending' NOT NULL,
	"notified_at" timestamp with time zone,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"full_name" text NOT NULL,
	"company" text,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"service" text NOT NULL,
	"project_description" text NOT NULL,
	"budget_range" text,
	"preferred_deadline" text,
	"consent" boolean DEFAULT false NOT NULL,
	CONSTRAINT "quote_requests_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_hash" text NOT NULL,
	"csrf_token" text NOT NULL,
	"user_id" uuid NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	CONSTRAINT "sessions_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"role" "user_role" DEFAULT 'admin' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_actor_admin_id_users_id_fk" FOREIGN KEY ("actor_admin_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "career_applications" ADD CONSTRAINT "career_applications_assigned_admin_id_users_id_fk" FOREIGN KEY ("assigned_admin_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_inquiries" ADD CONSTRAINT "contact_inquiries_assigned_admin_id_users_id_fk" FOREIGN KEY ("assigned_admin_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_requests" ADD CONSTRAINT "quote_requests_assigned_admin_id_users_id_fk" FOREIGN KEY ("assigned_admin_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activity_submission_idx" ON "activity_logs" USING btree ("submission_kind","submission_id");--> statement-breakpoint
CREATE INDEX "activity_created_idx" ON "activity_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "attachments_submission_idx" ON "attachments" USING btree ("submission_kind","submission_id");--> statement-breakpoint
CREATE INDEX "career_status_idx" ON "career_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "career_created_idx" ON "career_applications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "career_email_idx" ON "career_applications" USING btree ("email");--> statement-breakpoint
CREATE INDEX "contact_status_idx" ON "contact_inquiries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "contact_created_idx" ON "contact_inquiries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "contact_email_idx" ON "contact_inquiries" USING btree ("email");--> statement-breakpoint
CREATE INDEX "quote_status_idx" ON "quote_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "quote_created_idx" ON "quote_requests" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "quote_service_idx" ON "quote_requests" USING btree ("service");--> statement-breakpoint
CREATE INDEX "quote_email_idx" ON "quote_requests" USING btree ("email");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");