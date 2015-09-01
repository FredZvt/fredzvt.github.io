---
layout: post
title: Split Screen with Multiple Cameras and Pause GUI overlay
---

My study today is all about cameras. I'll describe how I've created the below game using multiple cameras. Note that, albeit I've chosen to create a 2D game, all the techniques are exactly the same to a 3D game.

The features that I searched to implement in this study were:

<div class="message">
	<ul>
	   <li>Split screen</li>
	   <li>GUI elements owned by each screen.</li>
	   <li>Make each camera follow a different player.</li>
	   <li>Pause GUI elements overlaying the split screen, using the entire screen space.</li>
	</ul>
</div>

You can find the source for this article at [GitHub](https://github.com/FredZvt/unity-split-screen).

In the video below you can see the final result of this article:

<iframe src="http://www.youtube.com/embed/SsXwZKo-uOI?rel=0&amp;showinfo=0" width="800" height="600" frameborder="0"></iframe>

## Splitting the screen in two cameras

Well, this part was really simple and fast. Unity let us define what part of available screen space we'll use to render the camera in the **Viewport Rect** property. Thus, we just have to setup both camera height to 0.5 and the top camera's Y position to 0.5. That's it! Now our screen's top half will be rendered through the first camera and the bottom half through the second.

![]({{ site.baseurl }}public/images/unity-split-screen/camera-viewport-rect.jpg "")

## Creating GUI elements for each camera

When we create GUI elements in UNITY, every camera that has a *GUILayer* component (all, by default) will render that element. To prevent a GUI element to be rendered by a camera, we have to include that GUI element in a specific layer and exclude this layer from the camera's **Culling Mask** property.

![]({{ site.baseurl }}public/images/unity-split-screen/gui-text-excluded-from-camera.jpg "")

## Controlling the players
I have not devoted much attention to the control of the players in this case because it was not the intention of the study. I just applied simple forces for lateral moves and a pseudo "jump" that can be activated at any time.

The implementation of pause for *Rigidbody2D* was the only interesting thing I discovered in this study with respect to the control of the characters. It seems that there is no built-in way to pause a *Rigidbody2D*. The solution I found in my research was to save the velocity vector and the value of angular velocity and enable the property *isKinematic*, effectively stopping the object at the point where it is. To continue the movement when we unpause, just disable the property *isKinematic*, apply the saved velocity vector as an impulse and the saved value of angular velocity as a torque.

{% highlight CSharp %}
[RequireComponent(typeof(Rigidbody2D))]
public class PlayerController : MonoBehaviour
{
	public KeyCode JumpKey;
	public KeyCode LeftKey;
	public KeyCode RightKey;
	public float JumpForce = 1f;
	public float MoveForce = 1f;
	public float maxSpeed = 10f;
	
	private bool paused = false;
	private Rigidbody2D Body;
	private Vector2 savedVelocity;
	private float savedAngularVelocity;
	
	void Start()
	{
		Body = GetComponent<Rigidbody2D>();
	}

	void Update()
	{
		if (!paused) 
		{
			if (Input.GetKeyDown(JumpKey))
				Body.AddForce(new Vector2(0, JumpForce));
			
			if (Input.GetKey(LeftKey))
				Body.AddForce(new Vector2(-MoveForce, 0));
			
			if (Input.GetKey(RightKey))
				Body.AddForce(new Vector2(MoveForce, 0));
		
			if (Mathf.Abs(Body.velocity.x) > maxSpeed || 
				Mathf.Abs(Body.velocity.y) > maxSpeed) 
				Body.velocity = Body.velocity.normalized * maxSpeed;
		}
	}
	
	public void Pause()
	{
		paused = true;
		savedVelocity = Body.velocity;
		savedAngularVelocity = Body.angularVelocity;
		Body.isKinematic = true;
	}
	
	public void Unpause()
	{
		paused = false;
		Body.isKinematic = false;        
		Body.AddForce(savedVelocity, ForceMode2D.Impulse);
		Body.AddTorque(savedAngularVelocity, ForceMode2D.Force);
		Body.WakeUp();
	}
}
{% endhighlight %}

## Controlling the cameras

My original intention was that the cameras follow the players in the simplest possible way, but it proved very easy by simply repositioning the camera to the player's position at every update. So I decided to add some smoothness to the camera's movement by adding a linear interpolation to the motion (using *Vector3.Lerp* function) and also constrain the camera to the stage limits so we did not see on the outside of the walls, ceiling and floor.

To pause the camera, we just need to stop repositioning it. A simple flag will do it.

{% highlight CSharp %}
public class CameraController : MonoBehaviour
{
    public Transform target;
    
    private bool paused = false;
        
    private Vector2 stageBottomLeft = 
        new Vector2(-4.712282f, -7.241384f);
        
    private Vector2 stageTopRight = 
        new Vector2(4.677763f, 25.06674f);
    
    void Start()
    {
        var targetPosition = CopyVector(target.position);
        var constrainedPosition = ConstrainCameraToStage(targetPosition);
        transform.position = constrainedPosition;
    }
    
    void Update()
    {
        if (!paused) {
            var targetPosition = CopyVector(target.position);
            var constrainedPosition = ConstrainCameraToStage(targetPosition);
            transform.position = SmoothMovement(constrainedPosition);
        }
    }
    
    public void Pause()
    {
        this.paused = true;
    }
    
    public void Unpause()
    {
        this.paused = false;
    }    
    
    private Vector3 CopyVector(Vector3 v)
    {
        return new Vector3(v.x, v.y, -10f);
    }
    
    private Vector3 SmoothMovement(Vector3 targetPosition)
    {
        return Vector3.Lerp(
            transform.position, 
            targetPosition, 
            Time.deltaTime * 5f
        );
    }
    
    private Vector3 ConstrainCameraToStage(Vector3 targetPosition)
    {
        var constrainedTargetPosition = targetPosition;
    
        if (targetPosition.x > stageTopRight.x)
            constrainedTargetPosition.x = stageTopRight.x;
        else if (targetPosition.x < stageBottomLeft.x)
            constrainedTargetPosition.x = stageBottomLeft.x;
        
        if (targetPosition.y > stageTopRight.y)
            constrainedTargetPosition.y = stageTopRight.y;
        else if (targetPosition.y < stageBottomLeft.y)
            constrainedTargetPosition.y = stageBottomLeft.y;
            
        return constrainedTargetPosition;
    }
}
{% endhighlight %}

## Implementing pause

This was the part I found most interesting in this study. In order to render a GUI on top of content rendered by cameras already present, we have to create a new camera that will use all the available screen space, put it "above the other" **setting *Depth* property with a value greater than that of other cameras** and do not clear what has already been rendered by other cameras **setting its *Clear Flags* property with the value "Do not Clear".**

Once the new camera has been configured, we can create the GUI exclusively for it using the same technique described in the topic "Creating GUI elements for each camera."

![]({{ site.baseurl }}public/images/unity-split-screen/camera-layers.jpg "")

![]({{ site.baseurl }}public/images/unity-split-screen/pause-menu-camera.jpg "")

To display or hide the pause GUI, I've grouped all GUI elements under an empty *GameObject* and enable or disable this object. Below is the full script that I've used to react to the press of the P key:

{% highlight CSharp %}
public class MainScript : MonoBehaviour
{
    public PlayerController PlayerOne;
    public PlayerController PlayerTwo;
    public CameraController TopCamera;
    public CameraController BottomCamera;
    public GameObject PauseMenu;

    private bool paused = false;

    void Start()
    {
        if (PlayerOne == null)
            throw new UnityException("PlayerOne is null.");
            
        if (PlayerTwo == null)
            throw new UnityException("PlayerTwo is null.");
        
        if (TopCamera == null)
            throw new UnityException("TopCamera is null.");
        
        if (BottomCamera == null)
            throw new UnityException("BottomCamera is null.");
        
        if (PauseMenu == null)
            throw new UnityException("PauseMenu is null.");
    }
    
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.P))
        {
            if (paused)
            {
                paused = false;
                PauseMenu.SetActive(false);
                PlayerOne.Unpause();
                PlayerTwo.Unpause();
                TopCamera.Unpause();
                BottomCamera.Unpause();
            }
            else
            {
                paused = true;
                PauseMenu.SetActive(true);
                PlayerOne.Pause();
                PlayerTwo.Pause();
                TopCamera.Pause();
                BottomCamera.Pause();
            }
        }
    }
}
{% endhighlight %}

## Credits

* [Art assets from Kenney](http://kenney.nl/)
* [Font Early GameBoy by Jimmy Campbell](http://www.dafont.com/pt/early-gameboy.font)

## References

* [Unity Manual: Camera](http://docs.unity3d.com/Manual/class-Camera.html)
* [Unity Answers: Splitscreen w/ different GUIs on each camera](http://answers.unity3d.com/questions/143543/splitscreen-w-different-guis-on-each-camera.html)
* [Unity Forum: single GUI on split-screen](http://forum.unity3d.com/threads/single-gui-on-split-screen.6125/)
* [Unity Answers: Pausing and Resuming a Rigidbody](http://answers.unity3d.com/questions/284068/pauseing-and-resuming-a-rigidbody.html)
