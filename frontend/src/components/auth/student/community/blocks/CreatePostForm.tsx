import { useState } from "react";
import { Box, Stack, Inline } from "@/components/shared/primitives";

interface Props {
  onSubmit: (data: { content: string; image?: File }) => void;
}

export function CreatePostForm({ onSubmit }: Props) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | undefined>();

  function handleSubmit() {
    if (!content.trim()) return;

    onSubmit({ content, image });
    setContent("");
    setImage(undefined);
  }

  return (
    <Box
      style={{
        border: "1px solid #eee",
        borderRadius: 12,
        padding: 16,
      }}
    >
      <Stack gap={12}>
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ resize: "none", padding: 8 }}
        />

        <input type="file" onChange={(e) => setImage(e.target.files?.[0])} />

        <Inline justify="end">
          <button onClick={handleSubmit}>Post</button>
        </Inline>
      </Stack>
    </Box>
  );
}
