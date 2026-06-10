import { useEffect } from "react";

export default function VoiceflowChat() {
  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
    script.type = "text/javascript";

    script.onload = () => {
      if (window.voiceflow) {
        window.voiceflow.chat.load({
          verify: {
            projectID: "6a28d7f9cfdfc5daea811967",
          },
          url: "https://general-runtime.voiceflow.com",
          voice: {
            url: "https://runtime-api.voiceflow.com",
          },
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}