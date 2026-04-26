mixins.highlight = {
    data() {
        return { copying: false };
    },
    created() {
        hljs.configure({ ignoreUnescapedHTML: true });
        this.renderers.push(this.highlight);
    },
    methods: {
        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
        highlight() {
            let codes = document.querySelectorAll("pre");
            for (let i of codes) {
                let code = i.textContent;
                let language = [...i.classList, ...i.firstChild.classList][0] || "plaintext";
                let highlighted;
                try {
                    highlighted = hljs.highlight(code, { language }).value;
                } catch {
                    highlighted = code;
                }
                i.innerHTML = `
                <div class="code-content hljs">${highlighted}</div>
                <div class="language">${language}</div>
                <div class="copycode">
                    <i class="fa-solid fa-chevron-down fold-btn fa-fw"></i>
                    <i class="fa-solid fa-expand expand-btn fa-fw"></i>
                    <i class="fa-solid fa-copy copy-btn fa-fw"></i>
                    <i class="fa-solid fa-check check-btn fa-fw"></i>
                </div>
                `;
                let content = i.querySelector(".code-content");
                hljs.lineNumbersBlock(content, { singleLine: true });
                let copycode = i.querySelector(".copycode");
                
                let foldBtn = i.querySelector(".fold-btn");
                let expandBtn = i.querySelector(".expand-btn");
                let copyBtn = i.querySelector(".copy-btn");

                foldBtn.addEventListener("click", () => {
                    if (i.classList.contains("folded")) {
                        foldBtn.classList.remove("fa-chevron-right");
                        foldBtn.classList.add("fa-chevron-down");
                        i.classList.remove("folded");
                    } else {
                        foldBtn.classList.remove("fa-chevron-down");
                        foldBtn.classList.add("fa-chevron-right");
                        i.classList.add("folded");
                    }
                });

                expandBtn.addEventListener("click", () => {
                    if (i.classList.contains("expanded")) {
                        expandBtn.classList.remove("fa-compress");
                        expandBtn.classList.add("fa-expand");
                        i.classList.remove("expanded");
                    } else {
                        expandBtn.classList.remove("fa-expand");
                        expandBtn.classList.add("fa-compress");
                        i.classList.add("expanded");
                    }
                });

                copyBtn.addEventListener("click", async () => {
                    if (this.copying) return;
                    this.copying = true;
                    copycode.classList.add("copied");
                    await navigator.clipboard.writeText(code);
                    await this.sleep(1000);
                    copycode.classList.remove("copied");
                    this.copying = false;
                });
            }
        },
    },
};
