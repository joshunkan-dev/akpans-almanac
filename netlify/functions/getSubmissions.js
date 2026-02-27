exports.handler = async () => {
  const token = process.env.GITHUB_TOKEN;
  const repo = "joshunkan-dev/akpans-almanac";
  const filePath = "submissions.json";

  const response = await fetch(
    `https://api.github.com/repos/${repo}/contents/${filePath}`,
    {
      headers: { Authorization: `token ${token}` }
    }
  );

  const data = await response.json();
  const content = JSON.parse(
    Buffer.from(data.content, "base64").toString()
  );

  return {
    statusCode: 200,
    body: JSON.stringify(content)
  };
};
