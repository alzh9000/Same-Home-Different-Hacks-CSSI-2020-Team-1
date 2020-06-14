## Same Home Different Hacks: Daince
Submitted for the "Educational" track. It also can be considered for the "Best use of Google Cloud" since it uses Firebase and "Best Domain Name".

##Inspiration
Dance is a beautiful art form and many people want to learn it, as shown by the growing number of dance studios. With our new physically-distanced world, we can no longer take advantage of that. Learning dance moves from choreography videos is a wonderful tool, but videos cannot tell you if you are doing a dance move correctly. We want people to experience the benefits of a real-life coach with the convenience of on-demand video.

##What it does
DAINCE uses artificial intelligence to detect people’s dance moves. It evaluates and tracks how a person is dancing compared to how the dance should be performed, so users of DAINCE learn how to dance better and assess their progress in learning dances. 

##How we built it
Beginning with our vision for an AI dance tutorial, we designed a wireframe mockup of the flow of our app and functionality of the pose comparison algorithm. On the front end, we used HTML & CSS to style the site and extensive Javascript to import and implement. We used the Posenet library to implement AI-based pose detection. Meanwhile, the backend team worked on retrieving videos and a list of timestamp markers. Tutorial videos loop according to the timestamps and those markers can be skipped, ignored, and replayed. Feedback from a webcam is taken and used to display a live score. The score is calculated by comparing the data from the webcam to the data from the original/professional dance video. 
 
##Challenges we ran into
Challenge 1 - We faced major hurdles when attempting to implement the PoseNet model, especially due to the complexity of extracting frames of a webcam/video and applying it. Some relatively simple features, like plotting the points of where PoseNet estimated limbs to be, actually required a lot of tinkering to erase the points after a certain period of time (so that the screen doesn’t become cluttered).

Challenge 2 - We have encountered various issues that may seem trivial at first glance, but turned out to have consumed large amounts of time and energy. For example, we spent hours attempting to fix a problem caused by a misplaced iteration variable in a for-loop as we initially thought the problem was caused by something else. We also spent a long time figuring out async/await statements for a few functions to solve a problem that could be solved with a simple if-else statement. Through rigorous checking and testing, discussion with team members working on other parts of the app, and lots of googling, we were able to overcome these challenges.

Challenge 3 - Because of our diverse set of skills, it was initially difficult for us to divy up the tasks we needed to accomplish in order to build DAINCE. However, by working together and playing to each others’ strengths, we were able to work on the areas that we were the most well suited for, and thus succeed as a team. 

Challenge 4 - As a remote group, we had to work through merging issues on Github, real-time partner coding software, and varying timezones. Still, even though we have never met, we managed to create something beautiful together. 

##Accomplishments that we’re proud of
We are exceptionally proud of how our project can better teach people dance and enhance learning from choreography videos/tutorials. 
Our awesome web designer created a fantastic web mockup that we translated into real-life. Then we took it even farther and added beautiful micro-interactions. Subtle CSS transitions were added to most elements. If there was a user interface award in this hackathon, we are confident that we’d be strong contenders. 
In addition, applying the PoseNet model on both a video and live webcam footage required creativity and robust programming. Comparing the two with an algorithm was also an exceptionally difficult challenge that we conquered!
 
##What we learned
Working with PoseNet introduced all of us to a complex AI algorithm that piqued our interest and served as a great introduction to working with big datasets. Everyone also took away different things from this project depending on their focuses. For example, the web developers learned how to create CSS animations and use JQuery to show/hide different elements. People who worked on the backend improved their skills with Firebase and handled difficult interactions with PoseNet objects.
 
##What's next for DAINCE?
From the data we glean from our user’s dance moves and perhaps a few more hours, we would be able to develop custom dance plans with specific instruction with which users can improve their weak points. With the same data, perhaps we can write something that choreographs new dances using the user’s strengths and moves they have already learned. 

