/**
 * Utility functions for handling hashtags and mentions in posts
 */

/**
 * Extract hashtags from text
 * Matches patterns like #hashtag
 */
export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#(\w+)/g;
  const matches = text.match(hashtagRegex);
  return matches
    ? matches
        .map((tag) => tag.substring(1).toLowerCase()) // Remove # and lowercase
        .filter((tag, index, self) => self.indexOf(tag) === index) // Remove duplicates
    : [];
}

/**
 * Extract mentions from text
 * Matches patterns like @username
 */
export function extractMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const matches = text.match(mentionRegex);
  return matches
    ? matches
        .map((mention) => mention.substring(1).toLowerCase()) // Remove @
        .filter((mention, index, self) => self.indexOf(mention) === index) // Remove duplicates
    : [];
}

/**
 * Convert hashtags array to formatted string
 * Input: ['fitness', 'workout']
 * Output: ' #fitness #workout'
 */
export function formatHashtags(hashtags: string[]): string {
  if (hashtags.length === 0) return "";
  return " " + hashtags.map((tag) => `#${tag}`).join(" ");
}

/**
 * Convert user IDs to formatted mentions
 * Requires a map of userId to userName
 */
export function formatUserTags(
  userIds: string[],
  userMap: Record<string, string>,
): string {
  if (userIds.length === 0) return "";
  return " " + userIds.map((id) => `@${userMap[id] || "User"}`).join(" ");
}

/**
 * Highlight hashtags and mentions in text
 * Returns positions and types of hashtags and mentions
 */
export function parseTagsInText(text: string): Array<{
  type: "hashtag" | "mention" | "text";
  value: string;
  start: number;
  end: number;
}> {
  const result: Array<{
    type: "hashtag" | "mention" | "text";
    value: string;
    start: number;
    end: number;
  }> = [];

  const regex = /(#\w+|@\w+)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      result.push({
        type: "text",
        value: text.substring(lastIndex, match.index),
        start: lastIndex,
        end: match.index,
      });
    }

    // Add the hashtag or mention
    const value = match[0];
    result.push({
      type: value.startsWith("#") ? "hashtag" : "mention",
      value,
      start: match.index,
      end: match.index + value.length,
    });

    lastIndex = match.index + value.length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    result.push({
      type: "text",
      value: text.substring(lastIndex),
      start: lastIndex,
      end: text.length,
    });
  }

  return result;
}
