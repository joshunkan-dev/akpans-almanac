exports.handler = async (event) => {
  const token = process.env.GITHUB_TOKEN;
  const repo = "joshunkan-dev/akpans-almanac";
  const filePath = "submissions.json";

  const { id } = JSON.parse(event.body);

  const getFile = await fetch(
    `https://api.github.com/repos/${repo}/contents/${filePath}`,
    {
      headers: { Authorization: `token ${token}` }
    }
  );

  const fileData = await getFile.json();
  const content = JSON.parse(
    Buffer.from(fileData.content, "base64").toString()
  );

  const updated = content.filter(post => post.id !== id);

  await fetch(
    `https://api.github.com/repos/${repo}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Delete submission",
        content: Buffer.from(JSON.stringify(updated, null, 2)).toString("base64"),
        sha: fileData.sha
      })
    }
  );

  return { statusCode: 200 };
};
