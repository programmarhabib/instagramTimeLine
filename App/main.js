// get form
const modalForm = document.getElementById("modalForm");
const post_update_form = document.getElementById("post_update_form");
const all_post = document.getElementById("all_post");
const msg = document.querySelector(".msg");

// show post function
showData = () => {
  const post_data = getLsData("fb_post");
  console.log(post_data);
  let content = "";
  if (post_data.length > 0) {
    post_data.reverse().map((data, index) => {
      content += `
      <div class="post-container">
      <!------- Post Header ------>
      <div class="post-header">
        <div class="author">
          <div class="author-profile-img">
            <img src="${data.author_photo}" alt="" />
          </div>
          <div class="post-author-name">
            <a href="#">${data.author_name}</a>
            <span><i class="fas fa-circle"></i> ${timeAgo(
              data.post_time
            )}</span>
            
          </div>
        </div>
        <div class="three-dot dropdown">
        <a class="dropdown-toggle" href="#" data-bs-toggle="dropdown"><i class="fas fa-ellipsis-h"></i></a>
          

             <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <li><a data-bs-toggle="modal"
            data-bs-target=".edit" class="dropdown-item edit_post" post_id=${
              data.id
            } href="">Edit</a></li>
            <hr>
            <li><a class="dropdown-item delete_post" post_id=${
              data.id
            } href="">Delete</a></li>
          </ul>
         


        </div>
      </div>
      
      
    
      <!------ Post Body ------>
      <div class="post-body">
        <div class="post-img">
          <img src="${data.post_photo}" alt="" />
        </div>
        <div class="post-reaction">
          <div class="p-reaction-left">
            <div class="post-like post-icon">
              <span><i class="far fa-heart"></i></span>
            </div>
            <div class="post-comment post-icon">
              <span><i class="far fa-comment"></i></span>
            </div>
            <div class="post-share post-icon">
              <span><i class="far fa-paper-plane"></i></span>
            </div>
          </div>
          <div class="post-save post-icon">
            <span><i class="far fa-bookmark"></i></span>
          </div>
        </div>
        <div class="post-like-total">
          <p>5,691,354 likes</p>
        </div>
        <div class="post-content">
          <p>
            ${data.content}
          </p>
        </div>
        <div class="write-comment">
          <p>View all 204 comments</p>
          <form action="#">
            <input
              type="text"
              name=""
              id=""
              placeholder="Add a comment…"
            />
          </form>
          <span><i class="far fa-smile"></i></span>
        </div>
      </div>
    </div>
      `;
    });
  } else {
    content = `<h4 class="text-center">No post found</h4>
    <p class="text-center" >Please click <b>Create PLUS</b> Button for create post</p>`;
  }
  all_post.innerHTML = content;
};
showData();
//submit form
modalForm.onsubmit = (e) => {
  e.preventDefault();
  let form_data = new FormData(e.target);
  let data = Object.fromEntries(form_data.entries());
  let { author_name, author_photo, content, post_photo } = Object.fromEntries(
    form_data.entries()
  );

  let postId = Math.floor(Math.random() * 1000) + "_" + Date.now();
  if (!author_name || !author_photo) {
    msg.innerHTML = alertMsg("all filed are required");
  } else {
    const prevData = getLsData("fb_post");
    prevData.push({
      author_name: author_name,
      author_photo: author_photo,
      content: content,
      post_photo: post_photo,
      post_time: Date.now(),
      id: postId,
    });
    setLsData("fb_post", prevData);
    showData();
    e.target.reset();
  }
};

// delete post
all_post.onclick = (e) => {
  e.preventDefault();

  //delete post
  if (e.target.classList.contains("delete_post")) {
    console.log(e.target);
    let Did = e.target.getAttribute("post_id");
    let prevData = getLsData("fb_post");
    console.log(prevData);
    let prevDat = prevData.filter((data) => data.id !== Did);
    setLsData("fb_post", prevDat);
    showData();
  }

  // edit post
  if (e.target.classList.contains("edit_post")) {
    let postId = e.target.getAttribute("post_id");
    let prevData = getLsData("fb_post");
    prevData = prevData.find((data) => data.id == postId);
    post_update_form.innerHTML = `
    <div class="my-2">
    <input
      type="text"
      placeholder="author name"
      class="form-control"
      name="author_name"
      value="${prevData.author_name}"
    />
  </div>
  <div class="my-2">
    <input
      type="text"
      placeholder="author photo URL"
      class="form-control"
      name="author_photo"
      
      value="${prevData.author_photo}"
    />
    <img class="w-100" src="${prevData.author_photo}" alt="" />
  </div>

  <div>
    <textarea
      class="form-control"
      name="content"
      id=""
      cols="30"
      rows="5"
      
    >${prevData.content}</textarea>
  </div>
  <div class="my-2">
    <input
      type="text"
      placeholder="post img url"
      class="form-control"
      name="post_photo"
      value="${prevData.post_photo}"
    />
    <img class="w-100" src="${prevData.post_photo}" alt="" />
    
    
  </div>
  <div class="my-2">
    <input
      type="text"
      placeholder="post id"
      class="form-control"
      name="post_id"
      readonly
      value="${prevData.id}"
    />
    
    
  </div>
  <button type="submit" class="btn btn-primary my-2">Update</button>
    
    `;
    console.log(prevData);
  }
};

// update post
// post_update_form.onsubmit = (e) => {
//   e.preventDefault();
//   let formData = new FormData(e.target);
//   let up_formData = Object.fromEntries(formData);
//   console.log(up_formData);
// };

// update post
post_update_form.onsubmit = (e) => {
  e.preventDefault();
  let formData = new FormData(e.target);
  let up_formData = Object.fromEntries(formData);

  // Get the post ID from the form's attributes
  let postId = up_formData.post_id; // Get the post_id from the form data
  console.log(postId);
  // Retrieve the existing post data from local storage
  let prevData = getLsData("fb_post");

  // Find the post in the array based on the post ID
  let editedPost = prevData.find((data) => data.id === postId);
  console.log(editedPost);
  if (editedPost) {
    // Check if the post with the given ID was found
    // Update the post data with the edited values
    editedPost.author_name = up_formData.author_name;
    editedPost.author_photo = up_formData.author_photo;
    editedPost.content = up_formData.content;
    editedPost.post_photo = up_formData.post_photo;

    // Save the updated post data back to local storage
    setLsData("fb_post", prevData);

    // Refresh the displayed posts
    showData();

    // Clear the edit form
    post_update_form.innerHTML = "";
  } else {
    // Post with the given postId not found, handle the error or display a message
    console.log("Error: Post not found.");
  }
};
