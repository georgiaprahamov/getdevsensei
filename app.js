/**
 * DevSENSEI Landing Page — Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {

    // ── Smooth scroll ────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const id = link.getAttribute('href');
            if (id === '#') return;
            const el = document.querySelector(id);
            if (el) {
                e.preventDefault();
                window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
                // Close mobile nav if open
                mobileNav.classList.remove('open');
            }
        });
    });

    // ── Sticky header ────────────────────────────────────────
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.style.background = 'rgba(11,12,16,0.97)';
            header.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
        } else {
            header.style.background = 'rgba(11,12,16,0.75)';
            header.style.boxShadow = 'none';
        }
    }, { passive: true });

    // ── Mobile menu ──────────────────────────────────────────
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    mobileMenuBtn?.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
    });

    // ── Intersection observer: fade-in cards ─────────────────
    const observerOpts = { threshold: 0.12 };
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
                observer.unobserve(e.target);
            }
        });
    }, observerOpts);

    document.querySelectorAll('.feature-card, .step-card, .mini-card').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
        observer.observe(el);
    });

    // ── Socratic Chat Simulator ──────────────────────────────
    const messagesContainer = document.getElementById('sim-messages-container');
    const typingIndicator = document.getElementById('sim-typing');
    const optionsContainer = document.getElementById('sim-options-container');
    const codeContent = document.getElementById('sim-code-content');

    if (!messagesContainer) return;

    const dialogueTree = {
        "1a": {
            userText: "I think <code>i</code> should start at 1, not 0.",
            aiText: "Interesting idea! But remember — what index do arrays start at in JavaScript? If we start at 1, won't we skip the element at index 0? 🤔",
            options: [
                { text: "Oh right! So the problem is i <= arr.length — we access an index that doesn't exist.", next: "1b_direct" },
                { text: "What if we just reverse the loop direction?", next: "1a_reverse" }
            ]
        },
        "1b": {
            userText: "The condition i <= arr.length could access a non-existent index.",
            aiText: "Exactly — brilliant catch! 🎯 Since the last valid index is <code>arr.length - 1</code>, when <code>i === arr.length</code> we're reading beyond the array, which gives <code>undefined</code>.<br><br>How would you fix the loop's exit condition to prevent this?",
            options: [
                { text: "We should use i < arr.length instead of i <= arr.length.", next: "correct_solution" },
                { text: "We could use i <= arr.length - 2.", next: "incorrect_minus_two" }
            ]
        },
        "1b_direct": {
            userText: "Oh right! So the problem is i <= arr.length — we access an index that doesn't exist.",
            aiText: "Exactly! You got there fast. 🎯 Indices run from <code>0</code> to <code>arr.length - 1</code>, so at <code>i === arr.length</code> we step out of bounds.<br><br>How would you correct the loop condition?",
            options: [
                { text: "Change the condition to i < arr.length.", next: "correct_solution" },
                { text: "Start iterating from the end instead.", next: "1a_reverse" }
            ]
        },
        "1c": {
            userText: "I don't see anything wrong — looks fine to me.",
            aiText: "No worries — let's trace through it together. 🧭 Imagine an array with 3 elements: <code>[10, 20, 30]</code>. Length is 3, valid indices are 0, 1, and 2.<br><br>What happens when the variable <code>i</code> reaches the value 3?",
            options: [
                { text: "It tries to read arr[3], which doesn't exist — that's undefined!", next: "1b_direct" },
                { text: "The loop just stops automatically without any issue.", next: "1c_wrong" }
            ]
        },
        "1a_reverse": {
            userText: "What if we just reverse the loop direction?",
            aiText: "Reversing is possible, but it doesn't fix the root issue with our condition. Let's stay focused on the forward loop. If we want to visit indices 0 through the last element, what's the upper bound of valid indices?",
            options: [
                { text: "The upper bound is arr.length - 1. So the condition should be i < arr.length.", next: "correct_solution" }
            ]
        },
        "incorrect_minus_two": {
            userText: "We could use i <= arr.length - 2.",
            aiText: "Close, but think it through — with a 3-element array (indices 0, 1, 2) and <code>i <= arr.length - 2</code>, the last iteration runs at <code>i = 1</code>. We'd completely skip the last element at index 2! There's a cleaner, standard way. What is it?",
            options: [
                { text: "Use strict less-than: i < arr.length.", next: "correct_solution" }
            ]
        },
        "1c_wrong": {
            userText: "The loop just stops automatically without any issue.",
            aiText: "Actually, the loop continues as long as the condition is true. Since 3 <= 3 is <code>true</code>, it executes for <code>i = 3</code> and tries to evaluate <code>arr[3] === target</code>. Since <code>arr[3]</code> is <code>undefined</code>, this either throws or gives a wrong answer. Can you see the bug now?",
            options: [
                { text: "Yes! Index 3 is out of bounds. We need i < arr.length.", next: "correct_solution" }
            ]
        },
        "correct_solution": {
            userText: "We should use i < arr.length instead of i <= arr.length.",
            aiText: "Brilliant! 🎉 You found it. Changing to <code>i &lt; arr.length</code> stops the loop exactly at the last valid index and traverses the array perfectly.<br><br>Look at the code on the left — it's now corrected and highlighted in green thanks to your understanding. That's the Socratic Method in action.",
            options: [],
            isFinished: true
        }
    };

    function scrollBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function streamText(el, text, cb) {
        let i = 0, html = '', inTag = false;
        el.innerHTML = '';
        (function type() {
            if (i >= text.length) {
                el.innerHTML = text;
                scrollBottom();
                cb?.();
                return;
            }
            const ch = text[i];
            if (ch === '<') inTag = true;
            html += ch;
            if (ch === '>') inTag = false;
            el.innerHTML = html;
            i++;
            scrollBottom();
            setTimeout(type, inTag ? 1 : 11);
        })();
    }

    function addMessage(role, text, cb) {
        const wrap = document.createElement('div');
        wrap.className = `chat-message ${role === 'mentor' ? 'mentor' : 'student'}`;

        const av = document.createElement('div');
        av.className = 'msg-avatar';
        av.textContent = role === 'mentor' ? '🧠' : '💻';

        const content = document.createElement('div');
        content.className = 'msg-content';

        const author = document.createElement('span');
        author.className = 'msg-author';
        author.innerHTML = role === 'mentor' ? 'DevSENSEI <span class="tag-bot">mentor</span>' : 'You';

        const msgEl = document.createElement('div');
        msgEl.className = 'msg-text';

        content.append(author, msgEl);
        wrap.append(av, content);
        messagesContainer.appendChild(wrap);
        scrollBottom();

        if (role === 'mentor') {
            streamText(msgEl, text, cb);
        } else {
            msgEl.innerHTML = text;
            scrollBottom();
            cb?.();
        }
    }

    function renderOptions(opts) {
        optionsContainer.innerHTML = '';
        opts.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'chat-option-btn';
            btn.innerHTML = opt.text;
            btn.addEventListener('click', () => handleStep(opt.next));
            optionsContainer.appendChild(btn);
        });
        scrollBottom();
    }

    function handleStep(key) {
        const step = dialogueTree[key];
        if (!step) return;
        optionsContainer.innerHTML = '';

        addMessage('student', step.userText, () => {
            setTimeout(() => {
                typingIndicator.style.display = 'flex';
                scrollBottom();
                setTimeout(() => {
                    typingIndicator.style.display = 'none';
                    addMessage('mentor', step.aiText, () => {
                        if (step.isFinished) {
                            updateCodeCorrect();
                            showReset();
                        } else {
                            renderOptions(step.options);
                        }
                    });
                }, 950);
            }, 450);
        });
    }

    function updateCodeCorrect() {
        codeContent.innerHTML = `<span class="line-num">1</span>  <span class="token keyword">function</span> <span class="token function">countOccurrences</span>(arr, target) {
<span class="line-num">2</span>    <span class="token keyword">let</span> count = <span class="token number">0</span>;
<span class="line-num">3</span>    <span class="token keyword" style="color:#50FA7B;text-shadow:0 0 10px rgba(80,250,123,0.4)">for</span> (<span class="token keyword" style="color:#50FA7B">let</span> i = <span class="token number">0</span>; i &lt; arr.length; i++) { <span class="token comment" style="color:#50FA7B">// Fixed!</span>
<span class="line-num">4</span>      <span class="token keyword">if</span> (arr[i] === target) {
<span class="line-num">5</span>        count++;
<span class="line-num">6</span>      }
<span class="line-num">7</span>    }
<span class="line-num">8</span>    <span class="token keyword">return</span> count;
<span class="line-num">9</span>  }`;
    }

    function resetCode() {
        codeContent.innerHTML = `<span class="line-num">1</span>  <span class="token keyword">function</span> <span class="token function">countOccurrences</span>(arr, target) {
<span class="line-num">2</span>    <span class="token keyword">let</span> count = <span class="token number">0</span>;
<span class="line-num">3</span>    <span class="token keyword">for</span> (<span class="token keyword">let</span> i = <span class="token number">0</span>; i &lt;= arr.length; i++) {
<span class="line-num">4</span>      <span class="token keyword">if</span> (arr[i] === target) {
<span class="line-num">5</span>        count++;
<span class="line-num">6</span>      }
<span class="line-num">7</span>    }
<span class="line-num">8</span>    <span class="token keyword">return</span> count;
<span class="line-num">9</span>  }`;
    }

    function showReset() {
        optionsContainer.innerHTML = '';
        const btn = document.createElement('button');
        btn.className = 'btn btn-primary btn-sm';
        btn.style.cssText = 'margin: 8px auto 0; display: block;';
        btn.textContent = 'Try again 🔄';
        btn.addEventListener('click', resetSimulator);
        optionsContainer.appendChild(btn);
        scrollBottom();
    }

    function resetSimulator() {
        messagesContainer.innerHTML = `
            <div class="chat-message mentor">
                <div class="msg-avatar">🧠</div>
                <div class="msg-content">
                    <span class="msg-author">DevSENSEI <span class="tag-bot">mentor</span></span>
                    <div class="msg-text">
                        Hey! Let's look at your <code>countOccurrences</code> function — it tries to count how many times <code>target</code> appears in <code>arr</code>.
                        <br><br>
                        Look closely at line 3: <code>for (let i = 0; i &lt;= arr.length; i++)</code>. Do you notice anything unusual about the loop's exit condition?
                    </div>
                </div>
            </div>`;
        resetCode();
        optionsContainer.innerHTML = `
            <button class="chat-option-btn" id="btn-opt-1a">I think <code>i</code> should start at 1, not 0.</button>
            <button class="chat-option-btn" id="btn-opt-1b">The condition <code>i &lt;= arr.length</code> could access a non-existent index.</button>
            <button class="chat-option-btn" id="btn-opt-1c">I don't see anything wrong — looks fine to me.</button>`;
        document.getElementById('btn-opt-1a')?.addEventListener('click', () => handleStep('1a'));
        document.getElementById('btn-opt-1b')?.addEventListener('click', () => handleStep('1b'));
        document.getElementById('btn-opt-1c')?.addEventListener('click', () => handleStep('1c'));
        scrollBottom();
    }

    // Initial option listeners
    document.getElementById('btn-opt-1a')?.addEventListener('click', () => handleStep('1a'));
    document.getElementById('btn-opt-1b')?.addEventListener('click', () => handleStep('1b'));
    document.getElementById('btn-opt-1c')?.addEventListener('click', () => handleStep('1c'));
});
