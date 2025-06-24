import mongoose from "mongoose";

// Mongoose connection
const MONGODB_URI = "mongodb+srv://llm615819:Vivek300705@cluster0.731u1du.mongodb.net/lms"; // replace `lms` with your DB name

// Define schemas (nested)
const lectureSchema = new mongoose.Schema({
  lectureId: String,
  lectureTitle: String,
  lectureDuration: Number,
  lectureUrl: String,
  isPreviewFree: Boolean,
  lectureOrder: Number,
}, { _id: false });

const chapterSchema = new mongoose.Schema({
  chapterId: String,
  chapterOrder: Number,
  chapterTitle: String,
  chapterContent: [lectureSchema],
}, { _id: false });

const courseSchema = new mongoose.Schema({
  courseTitle: String,
  courseDescription: String,
  coursePrice: Number,
  isPublished: Boolean,
  discount: Number,
  courseThumbnail: String,
  courseContent: [chapterSchema],
  educator: String,
  enrolledStudents: [String],
  courseRatings: [{ userId: String, rating: Number }],
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);

export const dummyCourses = [
  {
      "_id": "605c72efb3f1c2b1f8e4e1a1",
      "courseTitle": "Introduction to JavaScript",
      "courseDescription": "<h2>Learn the Basics of JavaScript</h2><p>JavaScript is a versatile programming language that powers the web. In this course, you will learn the fundamentals of JavaScript, including syntax, data types, and control structures.</p><p>This course is perfect for beginners who want to start their journey in web development. By the end of this course, you will be able to create interactive web pages and understand the core concepts of JavaScript.</p><ul><li>Understand the basics of programming</li><li>Learn how to manipulate the DOM</li><li>Create dynamic web applications</li></ul>",
      "coursePrice": 49.99,
      "isPublished": true,
      "discount": 20,
      "courseContent": [
          {
              "chapterId": "chapter1",
              "chapterOrder": 1,
              "chapterTitle": "Getting Started with JavaScript",
              "chapterContent": [
                  {
                      "lectureId": "lecture1",
                      "lectureTitle": "What is JavaScript?",
                      "lectureDuration": 16,
                      "lectureUrl": "https://youtu.be/CBWnBi-awSA",
                      "isPreviewFree": true,
                      "lectureOrder": 1
                  },
                  {
                      "lectureId": "lecture2",
                      "lectureTitle": "Setting Up Your Environment",
                      "lectureDuration": 19,
                      "lectureUrl": "https://youtu.be/4l87c2aeB4I",
                      "isPreviewFree": false,
                      "lectureOrder": 2
                  }
              ]
          },
          {
              "chapterId": "chapter2",
              "chapterOrder": 2,
              "chapterTitle": "Variables and Data Types",
              "chapterContent": [
                  {
                      "lectureId": "lecture3",
                      "lectureTitle": "Understanding Variables",
                      "lectureDuration": 20,
                      "lectureUrl": "https://youtu.be/pZQeBJsGoDQ",
                      "isPreviewFree": true,
                      "lectureOrder": 1
                  },
                  {
                      "lectureId": "lecture4",
                      "lectureTitle": "Data Types in JavaScript",
                      "lectureDuration": 10,
                      "lectureUrl": "https://youtu.be/ufHT2WEkkC4",
                      "isPreviewFree": false,
                      "lectureOrder": 2
                  }
              ]
          }
      ],
      "educator": "675ac1512100b91a6d9b8b24",
      "enrolledStudents": [
          "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
          "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
          "user_2qjlgkAqIMpiR2flWIRzvWKtE0w"
      ],
      "courseRatings": [
          {
              "userId": "user_2qjlgkAqIMpiR2flWIRzvWKtE0w",
              "rating": 5,
              "_id": "6773e37360cb0ab974342314"
          }
      ],
      "createdAt": "2024-12-17T08:16:53.622Z",
      "updatedAt": "2025-01-02T04:47:44.701Z",
      "__v": 4,
      "courseThumbnail": "https://img.youtube.com/vi/CBWnBi-awSA/maxresdefault.jpg"
  },
  {
      "_id": "675ac1512100b91a6d9b8b24",
      "courseTitle": "Advanced Python Programming",
      "courseDescription": "<h2>Deep Dive into Python Programming</h2><p>This course is designed for those who have a basic understanding of Python and want to take their skills to the next level. You will explore advanced topics such as decorators, generators, and context managers.</p><p>By the end of this course, you will be able to write efficient and clean Python code, and understand how to leverage Python's powerful features for real-world applications.</p><ul><li>Master advanced data structures</li><li>Implement object-oriented programming concepts</li><li>Work with libraries and frameworks</li></ul>",
      "coursePrice": 79.99,
      "isPublished": true,
      "discount": 15,
      "courseContent": [
          {
              "chapterId": "chapter1",
              "chapterOrder": 1,
              "chapterTitle": "Advanced Data Structures",
              "chapterContent": [
                  {
                      "lectureId": " lecture1",
                      "lectureTitle": "Lists and Tuples",
                      "lectureDuration": 720,
                      "lectureUrl": "https://youtu.be/HdLIMoQkXFA",
                      "isPreviewFree": true,
                      "lectureOrder": 1
                  },
                  {
                      "lectureId": "lecture2",
                      "lectureTitle": "Dictionaries and Sets",
                      "lectureDuration": 850,
                      "lectureUrl": "https://youtu.be/HdLIMoQkXFA",
                      "isPreviewFree": false,
                      "lectureOrder": 2
                  }
              ]
          },
          {
              "chapterId": "chapter2",
              "chapterOrder": 2,
              "chapterTitle": "Object-Oriented Programming",
              "chapterContent": [
                  {
                      "lectureId": "lecture3",
                      "lectureTitle": "Classes and Objects",
                      "lectureDuration": 900,
                      "lectureUrl": "https://youtu.be/HdLIMoQkXFA",
                      "isPreviewFree": true,
                      "lectureOrder": 1
                  },
                  {
                      "lectureId": "lecture4",
                      "lectureTitle": "Inheritance and Polymorphism",
                      "lectureDuration": 950,
                      "lectureUrl": "https://youtu.be/HdLIMoQkXFA",
                      "isPreviewFree": false,
                      "lectureOrder": 2
                  }
              ]
          }
      ],
      "educator": "675ac1512100b91a6d9b8b24",
      "enrolledStudents": [
          "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
          "user_2qjlgkAqIMpiR2flWIRzvWKtE0w"
      ],
      "courseRatings": [
          {
              "userId": "user_2qjlgkAqIMpiR2flWIRzvWKtE0w",
              "rating": 5,
              "_id": "6776369244daad0f313d81a9"
          }
      ],
      "createdAt": "2024-12-17T08:16:53.622Z",
      "updatedAt": "2025-01-02T06:47:54.446Z",
      "__v": 3,
      "courseThumbnail": "https://img.youtube.com/vi/HdLIMoQkXFA/maxresdefault.jpg"
  },
  {
      "_id": "605c72efb3f1c2b1f8e4e1ae",
      "courseTitle": "Cybersecurity Basics",
      "courseDescription": "<h2>Protect Systems and Networks</h2><p>Cybersecurity is critical in today's digital age. This course introduces the fundamentals of cybersecurity, including threat analysis, ethical hacking, and secure programming practices.</p><p>By the end of this course, you will understand how to identify vulnerabilities and implement security measures effectively.</p><ul><li>Understand security protocols</li><li>Learn about encryption techniques</li><li>Conduct basic penetration testing</li></ul>",
      "coursePrice": 69.99,
      "isPublished": true,
      "discount": 15,
      "courseContent": [
          {
              "chapterId": "chapter1",
              "chapterOrder": 1,
              "chapterTitle": "Introduction to Cybersecurity",
              "chapterContent": [
                  {
                      "lectureId": "lecture1",
                      "lectureTitle": "What is Cybersecurity?",
                      "lectureDuration": 10,
                      "lectureUrl": "https://youtu.be/samplelink5",
                      "isPreviewFree": true,
                      "lectureOrder": 1
                  },
                  {
                      "lectureId": "lecture2",
                      "lectureTitle": "Types of Cyber Threats",
                      "lectureDuration": 18,
                      "lectureUrl": "https://youtu.be/samplelink6",
                      "isPreviewFree": false,
                      "lectureOrder": 2
                  }
              ]
          },
          {
              "chapterId": "chapter2",
              "chapterOrder": 2,
              "chapterTitle": "Basic Security Practices",
              "chapterContent": [
                  {
                      "lectureId": "lecture3",
                      "lectureTitle": "Password Management",
                      "lectureDuration": 15,
                      "lectureUrl": "https://youtu.be/samplelink7",
                      "isPreviewFree": true,
                      "lectureOrder": 1
                  },
                  {
                      "lectureId": "lecture4",
                      "lectureTitle": "Network Security Essentials",
                      "lectureDuration": 20,
                      "lectureUrl": "https://youtu.be/samplelink8",
                      "isPreviewFree": false,
                      "lectureOrder": 2
                  }
              ]
          }
      ],
      "educator": "675ac1512100b91a6d9b8b24",
      "enrolledStudents": [
          "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
          "user_2qjlgkAqIMpiR2flWIRzvWKtE0w"
      ],
      "courseRatings": [],
      "createdAt": "2024-12-27T11:30:00.000Z",
      "updatedAt": "2024-12-31T04:14:49.773Z",
      "__v": 2,
      "courseThumbnail": "https://img.youtube.com/vi/jZFaMEqEqEQ/maxresdefault.jpg"
  },
  {
      "_id": "605c72efb3f1c2b1f8e4e1a7",
      "courseTitle": "Web Development Bootcamp",
      "courseDescription": "<h2>Become a Full-Stack Web Developer</h2><p>This comprehensive bootcamp covers everything you need to know to become a full-stack web developer. From HTML and CSS to JavaScript and backend technologies, this course is designed to take you from beginner to job-ready.</p><p>Throughout the course, you will work on real-world projects, build a portfolio, and gain the skills necessary to succeed in the tech industry.</p><ul><li>Learn front-end and back-end development</li><li>Build responsive and dynamic web applications</li><li>Understand databases and server-side programming</li></ul>",
      "coursePrice": 99.99,
      "isPublished": true,
      "discount": 25,
      "courseContent": [
          {
              "chapterId": "chapter1",
              "chapterOrder": 1,
              "chapterTitle": "HTML & CSS Basics",
              "chapterContent": [
                  {
                      "lectureId": "lecture1",
                      "lectureTitle": "Introduction to HTML",
                      "lectureDuration": 600,
                      "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                      "isPreviewFree": true,
                      "lectureOrder": 1
                  },
                  {
                      "lectureId": "lecture2",
                      "lectureTitle": "Styling with CSS",
                      "lectureDuration": 720,
                      "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                      "isPreviewFree": false,
                      "lectureOrder": 2
                  }
              ]
          },
          {
              "chapterId": "chapter2",
              "chapterOrder": 2,
              "chapterTitle": "JavaScript Fundamentals",
              "chapterContent": [
                  {
                      "lectureId": "lecture3",
                      "lectureTitle": "JavaScript Basics",
                      "lectureDuration": 800,
                      "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                      "isPreviewFree": true,
                      "lectureOrder": 1
                  },
                  {
                      "lectureId": "lecture4",
                      "lectureTitle": "DOM Manipulation",
                      "lectureDuration": 850,
                      "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                      "isPreviewFree": false,
                      "lectureOrder": 2
                  }
              ]
          }
      ],
      "educator": "675ac1512100b91a6d9b8b24",
      "enrolledStudents": [
          "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
          "user_2qjlgkAqIMpiR2flWIRzvWKtE0w"
      ],
      "courseRatings": [],
      "createdAt": "2024-12-17T08:16:53.622Z",
      "updatedAt": "2024-12-31T05:31:27.290Z",
      "__v": 2,
      "courseThumbnail": "https://img.youtube.com/vi/lpx2zFkapIk/maxresdefault.jpg"
  },
  {
      "_id": "605c72efb3f1c2b1f8e4e1ac",
      "courseTitle": "Cloud Computing Essentials",
      "courseDescription": "<h2>Master Cloud Fundamentals</h2><p>Learn the foundations of cloud computing and explore popular cloud platforms like AWS, Azure, and Google Cloud. This course is ideal for IT professionals and developers looking to transition to cloud-based solutions.</p><p>By the end of this course, you will understand cloud services, deployment models, and best practices for using cloud resources efficiently.</p><ul><li>Understand cloud architecture</li><li>Learn to work with AWS, Azure, and GCP</li><li>Explore serverless computing and storage solutions</li></ul>",
      "coursePrice": 69.99,
      "isPublished": true,
      "discount": 20,
      "courseContent": [
          {
              "chapterId": "chapter1",
              "chapterOrder": 1,
              "chapterTitle": "Cloud Fundamentals",
              "chapterContent": [
                  {
                      "lectureId": "lecture1",
                      "lectureTitle": "What is Cloud Computing?",
                      "lectureDuration": 600,
                      "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                      "isPreviewFree": true,
                      "lectureOrder": 1
                  },
                  {
                      "lectureId": "lecture2",
                      "lectureTitle": "Cloud Service Models",
                      "lectureDuration": 720,
                      "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                      "isPreviewFree": false,
                      "lectureOrder": 2
                  }
              ]
          },
          {
              "chapterId": "chapter2",
              "chapterOrder": 2,
              "chapterTitle": "Exploring Cloud Platforms",
              "chapterContent": [
                  {
                      "lectureId": "lecture3",
                      "lectureTitle": "AWS Basics",
                      "lectureDuration": 800,
                      "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                      "isPreviewFree": true,
                      "lectureOrder": 1
                  },
                  {
                      "lectureId": "lecture4",
                      "lectureTitle": "Introduction to Google Cloud",
                      "lectureDuration": 850,
                      "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                      "isPreviewFree": false,
                      "lectureOrder": 2
                  }
              ]
          }
      ],
      "educator": "675ac1512100b91a6d9b8b24",
      "enrolledStudents": [
          "user_2qjlgkAqIMpiR2flWIRzvWKtE0w"
      ],
      "courseRatings": [],
      "createdAt": "2024-12-17T08:16:53.622Z",
      "updatedAt": "2024-12-31T05:32:55.357Z",
      "__v": 1,
      "courseThumbnail": "https://img.youtube.com/vi/0yboGn8errU/maxresdefault.jpg"
  },
  {
      "_id": "605c72efb3f1c2b1f8e4e1ad",
      "courseTitle": "Data Science with Python",
      "courseDescription": "<h2>Start Your Data Science Journey</h2><p>Data Science is one of the most in-demand fields in the world. This course teaches you the essentials of data analysis, visualization, and machine learning using Python. Learn libraries like Pandas, NumPy, Matplotlib, and Scikit-learn.</p><p>By the end of this course, you will be equipped to work on real-world data projects and gain insights from data.</p><ul><li>Data cleaning and preprocessing</li><li>Exploratory Data Analysis (EDA)</li><li>Build predictive models</li></ul>",
      "coursePrice": 89.99,
      "isPublished": true,
      "discount": 20,
      "courseContent": [
          {
              "chapterId": "chapter1",
              "chapterOrder": 1,
              "chapterTitle": "Python for Data Science",
              "chapterContent": [
                  {
                      "lectureId": "lecture1",
                      "lectureTitle": "Python Basics",
                      "lectureDuration": 30,
                      "lectureUrl": "https://youtu.be/samplelink1",
                      "isPreviewFree": true,
                      "lectureOrder": 1
                  },
                  {
                      "lectureId": "lecture2",
                      "lectureTitle": "Working with NumPy",
                      "lectureDuration": 25,
                      "lectureUrl": "https://youtu.be/samplelink2",
                      "isPreviewFree": false,
                      "lectureOrder": 2
                  }
              ]
          },
          {
              "chapterId": "chapter2",
              "chapterOrder": 2,
              "chapterTitle": "Data Visualization",
              "chapterContent": [
                  {
                      "lectureId": "lecture3",
                      "lectureTitle": "Introduction to Matplotlib",
                      "lectureDuration": 20,
                      "lectureUrl": "https://youtu.be/samplelink3",
                      "isPreviewFree": true,
                      "lectureOrder": 1
                  },
                  {
                      "lectureId": "lecture4",
                      "lectureTitle": "Advanced Visualizations with Seaborn",
                      "lectureDuration": 25,
                      "lectureUrl": "https://youtu.be/samplelink4",
                      "isPreviewFree": false,
                      "lectureOrder": 2
                  }
              ]
          }
      ],
      "educator": "675ac1512100b91a6d9b8b24",
      "enrolledStudents": [
          "user_2qjlgkAqIMpiR2flWIRzvWKtE0w",
          "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
          "user_2qjlgkAqIMpiR2flWIRzvWKtE0w"
      ],
      "courseRatings": [
          {
              "userId": "user_2qjlgkAqIMpiR2flWIRzvWKtE0w",
              "rating": 5,
              "_id": "6773acf160cb0ab974342248"
          }
      ],
      "createdAt": "2024-12-27T10:00:00.000Z",
      "updatedAt": "2024-12-31T09:57:48.992Z",
      "__v": 3,
      "courseThumbnail": "https://img.youtube.com/vi/E4znbZgUWzA/maxresdefault.jpg"
  },
  {
      "_id": "605c72efb3f1c2b1f8e4e1aa",
      "courseTitle": "Data Science and Machine Learning",
      "courseDescription": "<h2>Unlock the Power of Data</h2><p>This course provides a comprehensive introduction to data science and machine learning. You will learn how to analyze data, build predictive models, and apply machine learning algorithms to real-world problems.</p><p>By the end of this course, you will have a solid understanding of data manipulation, visualization, and machine learning techniques, enabling you to make data-driven decisions.</p><ul><li>Understand data analysis and visualization</li><li>Learn machine learning algorithms and their applications</li><li>Work with popular data science libraries like Pandas and Scikit-Learn</li></ul>",
      "coursePrice": 89.99,
      "isPublished": true,
      "discount": 30,
      "courseContent": [
          {
              "chapterId": "chapter1",
              "chapterOrder": 1,
              "chapterTitle": "Introduction to Data Science",
              "chapterContent": [
                  {
                      "lectureId": "lecture1",
                      "lectureTitle": "What is Data Science?",
                      "lectureDuration": 600,
                      "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                      "isPreviewFree": true,
                      "lectureOrder": 1
                  },
                  {
                      "lectureId": "lecture2",
                      "lectureTitle": "Data Collection and Cleaning",
                      "lectureDuration": 720,
                      "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                      "isPreviewFree": false,
                      "lectureOrder": 2
                  }
              ]
          },
          {
              "chapterId": "chapter2",
              "chapterOrder": 2,
              "chapterTitle": "Machine Learning Basics",
              "chapterContent": [
                  {
                      "lectureId": "lecture3",
                      "lectureTitle": "Supervised vs Unsupervised Learning",
                      "lectureDuration": 800,
                      "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                      "isPreviewFree": true,
                      "lectureOrder": 1
                  },
                  {
                      "lectureId": "lecture4",
                      "lectureTitle": "Building Your First Model",
                      "lectureDuration": 850,
                      "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                      "isPreviewFree": false,
                      "lectureOrder": 2
                  }
              ]
          }
      ],
      "educator": "675ac1512100b91a6d9b8b24",
      "enrolledStudents": [
          "user_2qjlgkAqIMpiR2flWIRzvWKtE0w"
      ],
      "courseRatings": [],
      "createdAt": "2024-12-17T08:16:53.622Z",
      "updatedAt": "2025-01-02T06:53:59.753Z",
      "__v": 1,
      "courseThumbnail": "https://img.youtube.com/vi/631lFJdQvoo/maxresdefault.jpg"
  },
  {
      "_id": "605c72efb3f1c2b1f8e4e1ab",
      "courseTitle": "Introduction to Cybersecurity",
      "courseDescription": "<h2>Protect the Digital World</h2><p>This course covers the essentials of cybersecurity, including understanding threats, vulnerabilities, and how to secure systems against cyber-attacks. Ideal for beginners, this course will prepare you for a career in cybersecurity.</p><p>By the end of this course, you will be able to identify and mitigate risks, implement security best practices, and understand the fundamentals of encryption and network security.</p><ul><li>Understand common cybersecurity threats</li><li>Learn about encryption and secure communication</li><li>Explore tools for penetration testing</li></ul>",
      "coursePrice": 59.99,
      "isPublished": true,
      "discount": 15,
      "courseContent": [
          {
              "chapterId": "chapter1",
              "chapterOrder": 1,
              "chapterTitle": "Cybersecurity Basics",
              "chapterContent": [
                  {
                      "lectureId": "lecture1",
                      "lectureTitle": "Introduction to Cybersecurity",
                      "lectureDuration": 700,
                      "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                      "isPreviewFree": true,
                      "lectureOrder": 1
                  },
                  {
                      "lectureId": "lecture2",
                      "lectureTitle": "Understanding Cyber Threats",
                      "lectureDuration": 750,
                      "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                      "isPreviewFree": false,
                      "lectureOrder": 2
                  }
              ]
          },
          {
              "chapterId": "chapter2",
              "chapterOrder": 2,
              "chapterTitle": "Network Security Fundamentals",
              "chapterContent": [
                  {
                      "lectureId": "lecture3",
                      "lectureTitle": "Securing Networks",
                      "lectureDuration": 800,
                      "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                      "isPreviewFree": true,
                      "lectureOrder": 1
                  },
                  {
                      "lectureId": "lecture4",
                      "lectureTitle": "Firewalls and VPNs",
                      "lectureDuration": 850,
                      "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                      "isPreviewFree": false,
                      "lectureOrder": 2
                  }
              ]
          }
      ],
      "educator": "675ac1512100b91a6d9b8b24",
      "enrolledStudents": [
          "user_2qjlgkAqIMpiR2flWIRzvWKtE0w"
      ],
      "courseRatings": [],
      "createdAt": "2024-12-17T08:16:53.622Z",
      "updatedAt": "2025-01-02T06:56:13.208Z",
      "__v": 1,
      "courseThumbnail": "https://img.youtube.com/vi/WbV3zRgpw_E/maxresdefault.jpg"
  }
]
export const dummyCourses = [
    {
        "_id": "605c72efb3f1c2b1f8e4e1a1",
        "courseTitle": "Introduction to JavaScript",
        "courseDescription": "<h2>Learn the Basics of JavaScript</h2><p>JavaScript is a versatile programming language that powers the web. In this course, you will learn the fundamentals of JavaScript, including syntax, data types, and control structures.</p><p>This course is perfect for beginners who want to start their journey in web development. By the end of this course, you will be able to create interactive web pages and understand the core concepts of JavaScript.</p><ul><li>Understand the basics of programming</li><li>Learn how to manipulate the DOM</li><li>Create dynamic web applications</li></ul>",
        "coursePrice": 49.99,
        "isPublished": true,
        "discount": 20,
        "courseContent": [
            {
                "chapterId": "chapter1",
                "chapterOrder": 1,
                "chapterTitle": "Getting Started with JavaScript",
                "chapterContent": [
                    {
                        "lectureId": "lecture1",
                        "lectureTitle": "What is JavaScript?",
                        "lectureDuration": 16,
                        "lectureUrl": "https://youtu.be/CBWnBi-awSA",
                        "isPreviewFree": true,
                        "lectureOrder": 1
                    },
                    {
                        "lectureId": "lecture2",
                        "lectureTitle": "Setting Up Your Environment",
                        "lectureDuration": 19,
                        "lectureUrl": "https://youtu.be/4l87c2aeB4I",
                        "isPreviewFree": false,
                        "lectureOrder": 2
                    }
                ]
            },
            {
                "chapterId": "chapter2",
                "chapterOrder": 2,
                "chapterTitle": "Variables and Data Types",
                "chapterContent": [
                    {
                        "lectureId": "lecture3",
                        "lectureTitle": "Understanding Variables",
                        "lectureDuration": 20,
                        "lectureUrl": "https://youtu.be/pZQeBJsGoDQ",
                        "isPreviewFree": true,
                        "lectureOrder": 1
                    },
                    {
                        "lectureId": "lecture4",
                        "lectureTitle": "Data Types in JavaScript",
                        "lectureDuration": 10,
                        "lectureUrl": "https://youtu.be/ufHT2WEkkC4",
                        "isPreviewFree": false,
                        "lectureOrder": 2
                    }
                ]
            }
        ],
        "educator": "675ac1512100b91a6d9b8b24",
        "enrolledStudents": [
            "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
            "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
            "user_2qjlgkAqIMpiR2flWIRzvWKtE0w"
        ],
        "courseRatings": [
            {
                "userId": "user_2qjlgkAqIMpiR2flWIRzvWKtE0w",
                "rating": 5,
                "_id": "6773e37360cb0ab974342314"
            }
        ],
        "createdAt": "2024-12-17T08:16:53.622Z",
        "updatedAt": "2025-01-02T04:47:44.701Z",
        "__v": 4,
        "courseThumbnail": "https://img.youtube.com/vi/CBWnBi-awSA/maxresdefault.jpg"
    },
    {
        "_id": "675ac1512100b91a6d9b8b24",
        "courseTitle": "Advanced Python Programming",
        "courseDescription": "<h2>Deep Dive into Python Programming</h2><p>This course is designed for those who have a basic understanding of Python and want to take their skills to the next level. You will explore advanced topics such as decorators, generators, and context managers.</p><p>By the end of this course, you will be able to write efficient and clean Python code, and understand how to leverage Python's powerful features for real-world applications.</p><ul><li>Master advanced data structures</li><li>Implement object-oriented programming concepts</li><li>Work with libraries and frameworks</li></ul>",
        "coursePrice": 79.99,
        "isPublished": true,
        "discount": 15,
        "courseContent": [
            {
                "chapterId": "chapter1",
                "chapterOrder": 1,
                "chapterTitle": "Advanced Data Structures",
                "chapterContent": [
                    {
                        "lectureId": " lecture1",
                        "lectureTitle": "Lists and Tuples",
                        "lectureDuration": 720,
                        "lectureUrl": "https://youtu.be/HdLIMoQkXFA",
                        "isPreviewFree": true,
                        "lectureOrder": 1
                    },
                    {
                        "lectureId": "lecture2",
                        "lectureTitle": "Dictionaries and Sets",
                        "lectureDuration": 850,
                        "lectureUrl": "https://youtu.be/HdLIMoQkXFA",
                        "isPreviewFree": false,
                        "lectureOrder": 2
                    }
                ]
            },
            {
                "chapterId": "chapter2",
                "chapterOrder": 2,
                "chapterTitle": "Object-Oriented Programming",
                "chapterContent": [
                    {
                        "lectureId": "lecture3",
                        "lectureTitle": "Classes and Objects",
                        "lectureDuration": 900,
                        "lectureUrl": "https://youtu.be/HdLIMoQkXFA",
                        "isPreviewFree": true,
                        "lectureOrder": 1
                    },
                    {
                        "lectureId": "lecture4",
                        "lectureTitle": "Inheritance and Polymorphism",
                        "lectureDuration": 950,
                        "lectureUrl": "https://youtu.be/HdLIMoQkXFA",
                        "isPreviewFree": false,
                        "lectureOrder": 2
                    }
                ]
            }
        ],
        "educator": "675ac1512100b91a6d9b8b24",
        "enrolledStudents": [
            "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
            "user_2qjlgkAqIMpiR2flWIRzvWKtE0w"
        ],
        "courseRatings": [
            {
                "userId": "user_2qjlgkAqIMpiR2flWIRzvWKtE0w",
                "rating": 5,
                "_id": "6776369244daad0f313d81a9"
            }
        ],
        "createdAt": "2024-12-17T08:16:53.622Z",
        "updatedAt": "2025-01-02T06:47:54.446Z",
        "__v": 3,
        "courseThumbnail": "https://img.youtube.com/vi/HdLIMoQkXFA/maxresdefault.jpg"
    },
    {
        "_id": "605c72efb3f1c2b1f8e4e1ae",
        "courseTitle": "Cybersecurity Basics",
        "courseDescription": "<h2>Protect Systems and Networks</h2><p>Cybersecurity is critical in today's digital age. This course introduces the fundamentals of cybersecurity, including threat analysis, ethical hacking, and secure programming practices.</p><p>By the end of this course, you will understand how to identify vulnerabilities and implement security measures effectively.</p><ul><li>Understand security protocols</li><li>Learn about encryption techniques</li><li>Conduct basic penetration testing</li></ul>",
        "coursePrice": 69.99,
        "isPublished": true,
        "discount": 15,
        "courseContent": [
            {
                "chapterId": "chapter1",
                "chapterOrder": 1,
                "chapterTitle": "Introduction to Cybersecurity",
                "chapterContent": [
                    {
                        "lectureId": "lecture1",
                        "lectureTitle": "What is Cybersecurity?",
                        "lectureDuration": 10,
                        "lectureUrl": "https://youtu.be/samplelink5",
                        "isPreviewFree": true,
                        "lectureOrder": 1
                    },
                    {
                        "lectureId": "lecture2",
                        "lectureTitle": "Types of Cyber Threats",
                        "lectureDuration": 18,
                        "lectureUrl": "https://youtu.be/samplelink6",
                        "isPreviewFree": false,
                        "lectureOrder": 2
                    }
                ]
            },
            {
                "chapterId": "chapter2",
                "chapterOrder": 2,
                "chapterTitle": "Basic Security Practices",
                "chapterContent": [
                    {
                        "lectureId": "lecture3",
                        "lectureTitle": "Password Management",
                        "lectureDuration": 15,
                        "lectureUrl": "https://youtu.be/samplelink7",
                        "isPreviewFree": true,
                        "lectureOrder": 1
                    },
                    {
                        "lectureId": "lecture4",
                        "lectureTitle": "Network Security Essentials",
                        "lectureDuration": 20,
                        "lectureUrl": "https://youtu.be/samplelink8",
                        "isPreviewFree": false,
                        "lectureOrder": 2
                    }
                ]
            }
        ],
        "educator": "675ac1512100b91a6d9b8b24",
        "enrolledStudents": [
            "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
            "user_2qjlgkAqIMpiR2flWIRzvWKtE0w"
        ],
        "courseRatings": [],
        "createdAt": "2024-12-27T11:30:00.000Z",
        "updatedAt": "2024-12-31T04:14:49.773Z",
        "__v": 2,
        "courseThumbnail": "https://img.youtube.com/vi/jZFaMEqEqEQ/maxresdefault.jpg"
    },
    {
        "_id": "605c72efb3f1c2b1f8e4e1a7",
        "courseTitle": "Web Development Bootcamp",
        "courseDescription": "<h2>Become a Full-Stack Web Developer</h2><p>This comprehensive bootcamp covers everything you need to know to become a full-stack web developer. From HTML and CSS to JavaScript and backend technologies, this course is designed to take you from beginner to job-ready.</p><p>Throughout the course, you will work on real-world projects, build a portfolio, and gain the skills necessary to succeed in the tech industry.</p><ul><li>Learn front-end and back-end development</li><li>Build responsive and dynamic web applications</li><li>Understand databases and server-side programming</li></ul>",
        "coursePrice": 99.99,
        "isPublished": true,
        "discount": 25,
        "courseContent": [
            {
                "chapterId": "chapter1",
                "chapterOrder": 1,
                "chapterTitle": "HTML & CSS Basics",
                "chapterContent": [
                    {
                        "lectureId": "lecture1",
                        "lectureTitle": "Introduction to HTML",
                        "lectureDuration": 600,
                        "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                        "isPreviewFree": true,
                        "lectureOrder": 1
                    },
                    {
                        "lectureId": "lecture2",
                        "lectureTitle": "Styling with CSS",
                        "lectureDuration": 720,
                        "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                        "isPreviewFree": false,
                        "lectureOrder": 2
                    }
                ]
            },
            {
                "chapterId": "chapter2",
                "chapterOrder": 2,
                "chapterTitle": "JavaScript Fundamentals",
                "chapterContent": [
                    {
                        "lectureId": "lecture3",
                        "lectureTitle": "JavaScript Basics",
                        "lectureDuration": 800,
                        "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                        "isPreviewFree": true,
                        "lectureOrder": 1
                    },
                    {
                        "lectureId": "lecture4",
                        "lectureTitle": "DOM Manipulation",
                        "lectureDuration": 850,
                        "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                        "isPreviewFree": false,
                        "lectureOrder": 2
                    }
                ]
            }
        ],
        "educator": "675ac1512100b91a6d9b8b24",
        "enrolledStudents": [
            "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
            "user_2qjlgkAqIMpiR2flWIRzvWKtE0w"
        ],
        "courseRatings": [],
        "createdAt": "2024-12-17T08:16:53.622Z",
        "updatedAt": "2024-12-31T05:31:27.290Z",
        "__v": 2,
        "courseThumbnail": "https://img.youtube.com/vi/lpx2zFkapIk/maxresdefault.jpg"
    },
    {
        "_id": "605c72efb3f1c2b1f8e4e1ac",
        "courseTitle": "Cloud Computing Essentials",
        "courseDescription": "<h2>Master Cloud Fundamentals</h2><p>Learn the foundations of cloud computing and explore popular cloud platforms like AWS, Azure, and Google Cloud. This course is ideal for IT professionals and developers looking to transition to cloud-based solutions.</p><p>By the end of this course, you will understand cloud services, deployment models, and best practices for using cloud resources efficiently.</p><ul><li>Understand cloud architecture</li><li>Learn to work with AWS, Azure, and GCP</li><li>Explore serverless computing and storage solutions</li></ul>",
        "coursePrice": 69.99,
        "isPublished": true,
        "discount": 20,
        "courseContent": [
            {
                "chapterId": "chapter1",
                "chapterOrder": 1,
                "chapterTitle": "Cloud Fundamentals",
                "chapterContent": [
                    {
                        "lectureId": "lecture1",
                        "lectureTitle": "What is Cloud Computing?",
                        "lectureDuration": 600,
                        "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                        "isPreviewFree": true,
                        "lectureOrder": 1
                    },
                    {
                        "lectureId": "lecture2",
                        "lectureTitle": "Cloud Service Models",
                        "lectureDuration": 720,
                        "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                        "isPreviewFree": false,
                        "lectureOrder": 2
                    }
                ]
            },
            {
                "chapterId": "chapter2",
                "chapterOrder": 2,
                "chapterTitle": "Exploring Cloud Platforms",
                "chapterContent": [
                    {
                        "lectureId": "lecture3",
                        "lectureTitle": "AWS Basics",
                        "lectureDuration": 800,
                        "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                        "isPreviewFree": true,
                        "lectureOrder": 1
                    },
                    {
                        "lectureId": "lecture4",
                        "lectureTitle": "Introduction to Google Cloud",
                        "lectureDuration": 850,
                        "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                        "isPreviewFree": false,
                        "lectureOrder": 2
                    }
                ]
            }
        ],
        "educator": "675ac1512100b91a6d9b8b24",
        "enrolledStudents": [
            "user_2qjlgkAqIMpiR2flWIRzvWKtE0w"
        ],
        "courseRatings": [],
        "createdAt": "2024-12-17T08:16:53.622Z",
        "updatedAt": "2024-12-31T05:32:55.357Z",
        "__v": 1,
        "courseThumbnail": "https://img.youtube.com/vi/0yboGn8errU/maxresdefault.jpg"
    },
    {
        "_id": "605c72efb3f1c2b1f8e4e1ad",
        "courseTitle": "Data Science with Python",
        "courseDescription": "<h2>Start Your Data Science Journey</h2><p>Data Science is one of the most in-demand fields in the world. This course teaches you the essentials of data analysis, visualization, and machine learning using Python. Learn libraries like Pandas, NumPy, Matplotlib, and Scikit-learn.</p><p>By the end of this course, you will be equipped to work on real-world data projects and gain insights from data.</p><ul><li>Data cleaning and preprocessing</li><li>Exploratory Data Analysis (EDA)</li><li>Build predictive models</li></ul>",
        "coursePrice": 89.99,
        "isPublished": true,
        "discount": 20,
        "courseContent": [
            {
                "chapterId": "chapter1",
                "chapterOrder": 1,
                "chapterTitle": "Python for Data Science",
                "chapterContent": [
                    {
                        "lectureId": "lecture1",
                        "lectureTitle": "Python Basics",
                        "lectureDuration": 30,
                        "lectureUrl": "https://youtu.be/samplelink1",
                        "isPreviewFree": true,
                        "lectureOrder": 1
                    },
                    {
                        "lectureId": "lecture2",
                        "lectureTitle": "Working with NumPy",
                        "lectureDuration": 25,
                        "lectureUrl": "https://youtu.be/samplelink2",
                        "isPreviewFree": false,
                        "lectureOrder": 2
                    }
                ]
            },
            {
                "chapterId": "chapter2",
                "chapterOrder": 2,
                "chapterTitle": "Data Visualization",
                "chapterContent": [
                    {
                        "lectureId": "lecture3",
                        "lectureTitle": "Introduction to Matplotlib",
                        "lectureDuration": 20,
                        "lectureUrl": "https://youtu.be/samplelink3",
                        "isPreviewFree": true,
                        "lectureOrder": 1
                    },
                    {
                        "lectureId": "lecture4",
                        "lectureTitle": "Advanced Visualizations with Seaborn",
                        "lectureDuration": 25,
                        "lectureUrl": "https://youtu.be/samplelink4",
                        "isPreviewFree": false,
                        "lectureOrder": 2
                    }
                ]
            }
        ],
        "educator": "675ac1512100b91a6d9b8b24",
        "enrolledStudents": [
            "user_2qjlgkAqIMpiR2flWIRzvWKtE0w",
            "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
            "user_2qjlgkAqIMpiR2flWIRzvWKtE0w"
        ],
        "courseRatings": [
            {
                "userId": "user_2qjlgkAqIMpiR2flWIRzvWKtE0w",
                "rating": 5,
                "_id": "6773acf160cb0ab974342248"
            }
        ],
        "createdAt": "2024-12-27T10:00:00.000Z",
        "updatedAt": "2024-12-31T09:57:48.992Z",
        "__v": 3,
        "courseThumbnail": "https://img.youtube.com/vi/E4znbZgUWzA/maxresdefault.jpg"
    },
    {
        "_id": "605c72efb3f1c2b1f8e4e1aa",
        "courseTitle": "Data Science and Machine Learning",
        "courseDescription": "<h2>Unlock the Power of Data</h2><p>This course provides a comprehensive introduction to data science and machine learning. You will learn how to analyze data, build predictive models, and apply machine learning algorithms to real-world problems.</p><p>By the end of this course, you will have a solid understanding of data manipulation, visualization, and machine learning techniques, enabling you to make data-driven decisions.</p><ul><li>Understand data analysis and visualization</li><li>Learn machine learning algorithms and their applications</li><li>Work with popular data science libraries like Pandas and Scikit-Learn</li></ul>",
        "coursePrice": 89.99,
        "isPublished": true,
        "discount": 30,
        "courseContent": [
            {
                "chapterId": "chapter1",
                "chapterOrder": 1,
                "chapterTitle": "Introduction to Data Science",
                "chapterContent": [
                    {
                        "lectureId": "lecture1",
                        "lectureTitle": "What is Data Science?",
                        "lectureDuration": 600,
                        "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                        "isPreviewFree": true,
                        "lectureOrder": 1
                    },
                    {
                        "lectureId": "lecture2",
                        "lectureTitle": "Data Collection and Cleaning",
                        "lectureDuration": 720,
                        "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                        "isPreviewFree": false,
                        "lectureOrder": 2
                    }
                ]
            },
            {
                "chapterId": "chapter2",
                "chapterOrder": 2,
                "chapterTitle": "Machine Learning Basics",
                "chapterContent": [
                    {
                        "lectureId": "lecture3",
                        "lectureTitle": "Supervised vs Unsupervised Learning",
                        "lectureDuration": 800,
                        "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                        "isPreviewFree": true,
                        "lectureOrder": 1
                    },
                    {
                        "lectureId": "lecture4",
                        "lectureTitle": "Building Your First Model",
                        "lectureDuration": 850,
                        "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                        "isPreviewFree": false,
                        "lectureOrder": 2
                    }
                ]
            }
        ],
        "educator": "675ac1512100b91a6d9b8b24",
        "enrolledStudents": [
            "user_2qjlgkAqIMpiR2flWIRzvWKtE0w"
        ],
        "courseRatings": [],
        "createdAt": "2024-12-17T08:16:53.622Z",
        "updatedAt": "2025-01-02T06:53:59.753Z",
        "__v": 1,
        "courseThumbnail": "https://img.youtube.com/vi/631lFJdQvoo/maxresdefault.jpg"
    },
    {
        "_id": "605c72efb3f1c2b1f8e4e1ab",
        "courseTitle": "Introduction to Cybersecurity",
        "courseDescription": "<h2>Protect the Digital World</h2><p>This course covers the essentials of cybersecurity, including understanding threats, vulnerabilities, and how to secure systems against cyber-attacks. Ideal for beginners, this course will prepare you for a career in cybersecurity.</p><p>By the end of this course, you will be able to identify and mitigate risks, implement security best practices, and understand the fundamentals of encryption and network security.</p><ul><li>Understand common cybersecurity threats</li><li>Learn about encryption and secure communication</li><li>Explore tools for penetration testing</li></ul>",
        "coursePrice": 59.99,
        "isPublished": true,
        "discount": 15,
        "courseContent": [
            {
                "chapterId": "chapter1",
                "chapterOrder": 1,
                "chapterTitle": "Cybersecurity Basics",
                "chapterContent": [
                    {
                        "lectureId": "lecture1",
                        "lectureTitle": "Introduction to Cybersecurity",
                        "lectureDuration": 700,
                        "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                        "isPreviewFree": true,
                        "lectureOrder": 1
                    },
                    {
                        "lectureId": "lecture2",
                        "lectureTitle": "Understanding Cyber Threats",
                        "lectureDuration": 750,
                        "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                        "isPreviewFree": false,
                        "lectureOrder": 2
                    }
                ]
            },
            {
                "chapterId": "chapter2",
                "chapterOrder": 2,
                "chapterTitle": "Network Security Fundamentals",
                "chapterContent": [
                    {
                        "lectureId": "lecture3",
                        "lectureTitle": "Securing Networks",
                        "lectureDuration": 800,
                        "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                        "isPreviewFree": true,
                        "lectureOrder": 1
                    },
                    {
                        "lectureId": "lecture4",
                        "lectureTitle": "Firewalls and VPNs",
                        "lectureDuration": 850,
                        "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
                        "isPreviewFree": false,
                        "lectureOrder": 2
                    }
                ]
            }
        ],
        "educator": "675ac1512100b91a6d9b8b24",
        "enrolledStudents": [
            "user_2qjlgkAqIMpiR2flWIRzvWKtE0w"
        ],
        "courseRatings": [],
        "createdAt": "2024-12-17T08:16:53.622Z",
        "updatedAt": "2025-01-02T06:56:13.208Z",
        "__v": 1,
        "courseThumbnail": "https://img.youtube.com/vi/WbV3zRgpw_E/maxresdefault.jpg"
    }
]

const courseData = {
  courseTitle: "Introduction to JavaScript",
  courseDescription: `<h2>Learn the Basics of JavaScript</h2><p>JavaScript is a versatile programming language...</p>`,
  coursePrice: 49.99,
  isPublished: true,
  discount: 20,
  courseThumbnail: "https://img.youtube.com/vi/CBWnBi-awSA/maxresdefault.jpg",
  courseContent: [
    {
      chapterId: "chapter1",
      chapterOrder: 1,
      chapterTitle: "Getting Started with JavaScript",
      chapterContent: [
        {
          lectureId: "lecture1",
          lectureTitle: "What is JavaScript?",
          lectureDuration: 16,
          lectureUrl: "https://youtu.be/CBWnBi-awSA",
          isPreviewFree: true,
          lectureOrder: 1,
        },
        {
          lectureId: "lecture2",
          lectureTitle: "Setting Up Your Environment",
          lectureDuration: 19,
          lectureUrl: "https://youtu.be/4l87c2aeB4I",
          isPreviewFree: false,
          lectureOrder: 2,
        },
      ],
    },
    {
      chapterId: "chapter2",
      chapterOrder: 2,
      chapterTitle: "Variables and Data Types",
      chapterContent: [
        {
          lectureId: "lecture3",
          lectureTitle: "Understanding Variables",
          lectureDuration: 20,
          lectureUrl: "https://youtu.be/pZQeBJsGoDQ",
          isPreviewFree: true,
          lectureOrder: 1,
        },
        {
          lectureId: "lecture4",
          lectureTitle: "Data Types in JavaScript",
          lectureDuration: 10,
          lectureUrl: "https://youtu.be/ufHT2WEkkC4",
          isPreviewFree: false,
          lectureOrder: 2,
        },
      ],
    },
  ],
  educator: "675ac1512100b91a6d9b8b24",
  enrolledStudents: [
    "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
    "user_2qjlgkAqIMpiR2flWIRzvWKtE0w",
  ],
  courseRatings: [
    {
      userId: "user_2qjlgkAqIMpiR2flWIRzvWKtE0w",
      rating: 5,
    },
  ],
};

async function seedCourse() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const course = await Course.create(courseData);
    console.log("✅ Course seeded:", course._id);
  } catch (err) {
    console.error("❌ Error seeding course:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedCourse();
