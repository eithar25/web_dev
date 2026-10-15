// Function to greet the user and add their name to the list
function addName() {
  const input = document.getElementById('name');
  const name = input.value.trim();

  document.getElementById('welcome-text').textContent = `Hello, ${name}!`;

  const li = document.createElement('li');
  li.textContent = name;
  document.getElementById('list').appendChild(li);

  input.value = '';
}

function removeName(e) {
  if (e.target.nodeName === 'LI') {
    const name = e.target.textContent;
    document.getElementById('welcome-text').textContent = `Goodbye, ${name}!`;
    e.target.remove(); 
  }
}

document.getElementById('greet-btn').addEventListener('click', addName);
document.getElementById('list').addEventListener('click', removeName);