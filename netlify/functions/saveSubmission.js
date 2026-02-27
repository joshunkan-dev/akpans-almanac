exports.handler = async (event) => {
  const token = process.env.GITHUB_TOKEN;
  const repo = "joshunkan-dev/akpans-almanac";
  const filePath = "submissions.json";

  const newSubmission = JSON.parse(event.body);

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

  content.push(newSubmission);

  await fetch(
    `https://api.github.com/repos/${repo}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "New submission",
        content: Buffer.from(JSON.stringify(content, null, 2)).toString("base64"),
        sha: fileData.sha
      })
    }
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
};
