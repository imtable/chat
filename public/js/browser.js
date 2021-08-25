console.log('start');
const socket = io();

const userMsgEl = document.querySelector('.userForm_msg');

const postMsg = () => {
   const userFormEl = document.forms.userForm;
   userFormEl.addEventListener('submit', (ev) => {
      ev.preventDefault();
      if (!userMsgEl.value) {
         return;
      }
      const formData = new FormData(ev.target);
      const userName = formData.get('userForm_name');
      const msg = formData.get('userForm_msg');
      
      socket.emit('msgReq', { userName, msg }, (resData) => {
         // console.log(resData);
      });
   });
};
const getMsg = () => {
   const chatEl = document.querySelector('.chat');
   socket.on('msgRes', (data) => {
      const userName = data.userName;
      const msg = data.msg;
   
      const html = `
      <div class="chat_string">
        <span class="chat_name">${userName}</span>
        <span class="chat_msg">${msg}</span>
      </div>`
      chatEl.insertAdjacentHTML('beforeEnd', html);
      chatEl.scrollTo(0, chatEl.scrollHeight);
      userMsgEl.value = '';
   });
};

const postTyping = () => {
   const typingUpd = (ev) => {
      const userName = document.querySelector('.userForm_userName').value;   
      socket.emit('typingReq', { userName }, () => {
      });
   };

   userMsgEl.addEventListener('keydown', typingUpd);
};

let timerVal = null;
const timer = () => {
   clearTimeout(timerVal);
   timerVal = setTimeout(() => {
      const currentUser = document.querySelector(`#${userName}`);
      typingEl.removeChild(currentUser);
   }, 2222);
};
const getTyping = () => {
   socket.on('typingRes', (data) => {
      const userName = data.userName;
      const typingEl = document.querySelector('.chat_typing');

      const currentUser = document.querySelector(`#${userName}`);
      if (currentUser) {
         return;
      };
      
      const html = `
      <span class="chat_typing_userName" id="${userName}">${userName} is typing.. </span>`;
      typingEl.insertAdjacentHTML('beforeEnd', html);
      
      const timer = () => {
         let timerVal = null;
         clearTimeout(timerVal);
         timerVal = setTimeout(() => {
            const currentUser = document.querySelector(`#${userName}`);
            typingEl.removeChild(currentUser);
         }, 2222);
      };
      timer();
      console.log(currentUser)
   });
};

const init = () => {
   postMsg();
   getMsg();
   postTyping();
   getTyping();
};
init();
