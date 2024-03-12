async function fetchTranslations() {
  const url = chrome.runtime.getURL('translations.json');
  const response = await fetch(url);
  const translations = await response.json();
  return translations;
}

function translateTextContent(textContent, translations) {
  let modifiedText = textContent;
  // 遍历翻译字典中的每个模式
  Object.keys(translations).forEach(pattern => {
    // 检查模式是否包含 {dyn}
    if (pattern.includes('{dyn}')) {
      // 替换 {username} 占位符以匹配任何用户名
      const dynamicPattern = pattern.replace('{dyn}', '(.+)');
      // 创建正则表达式
      const regex = new RegExp(dynamicPattern, "i");
      // 尝试匹配文本内容
      const matches = regex.exec(textContent);
      // 如果有匹配项，并且捕获到用户名
      if (matches && matches[1]) {
        // 替换模式中的 {dyn} 占位符以及完整匹配的文本
        modifiedText = modifiedText.replace(matches[0], translations[pattern].replace('{dyn}', matches[1]));
      }
    } else {
      // 对于不包含 {username} 的模式，使用简单的全文匹配
      if (textContent.trim() === pattern) {
        modifiedText = translations[pattern];
      }
    }
  });
  return modifiedText;
}

function translatePlaceholders(translations) {
  // 找到所有带有 placeholder 属性的 textarea 和 input 元素
  const elements = document.querySelectorAll('textarea[placeholder], input[placeholder]');

  // 遍历这些元素并翻译它们的 placeholder 文本
  elements.forEach(element => {
    const text = element.getAttribute('placeholder');
    const translatedText = translations[text];
    if (translatedText) {
      element.setAttribute('placeholder', translatedText);
    }
  });
}


function translateNode(node, translations) {
  if (node.nodeType === Node.TEXT_NODE) {
    const translatedText = translateTextContent(node.nodeValue, translations);
    if (node.nodeValue !== translatedText) {
      node.nodeValue = translatedText;
    }
  } else if (node.nodeType === Node.ELEMENT_NODE && !['SCRIPT', 'STYLE', 'TEXTAREA'].includes(node.tagName)) {
    node.childNodes.forEach(child => translateNode(child, translations));
  }
}

async function main() {
  const translations = await fetchTranslations();
  translateNode(document.body, translations);
  translatePlaceholders(translations);  // 翻译所有占位符
  
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(newNode => {
        translateNode(newNode, translations);
        translatePlaceholders(translations); // 确保新节点的占位符也被翻译
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
}

main();
