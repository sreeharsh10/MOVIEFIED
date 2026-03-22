async function sendMessage(){

  const msg =
    document.getElementById("msg").value;

  const res = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":
        "Bearer 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"
      },
      body: JSON.stringify({

        model:"gpt-4.1-mini",

        messages:[
          {role:"user", content: msg}
        ]

      })

    }
  );

  const data = await res.json();

  const reply =
    data.choices[0].message.content;

  document.getElementById("chat").innerHTML +=
    "<p>You: "+msg+"</p>";

  document.getElementById("chat").innerHTML +=
    "<p>AI: "+reply+"</p>";

}