CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text','voice')),
  content TEXT,
  action TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id TEXT NOT NULL,
  event TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_created_at ON public.messages (created_at DESC);
CREATE INDEX idx_messages_telegram_id ON public.messages (telegram_id);
CREATE INDEX idx_events_created_at ON public.events (created_at DESC);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Demo dashboard: public read access for aggregate analytics
CREATE POLICY "Public can read messages"
  ON public.messages FOR SELECT
  USING (true);

CREATE POLICY "Public can read events"
  ON public.events FOR SELECT
  USING (true);
