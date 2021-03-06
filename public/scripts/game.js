
firstCard = undefined
secondCard = undefined
timer = ''
firstCardHasBeenFlipped = false
lockBoard = false

difficulty = [
    {
        name: "easy",
        timer: 30,
        gridHeight: 3,
        gridWidth: 3,
    }, 
    {
        name: "medium",
        timer: 20,
        gridHeight: 4,
        gridWidth: 5,
    },
    {
        name: "hard",
        timer: 10,
        gridHeight: 5,
        gridWidth: 6,
    }
]

function shuffleCards() {
    $(".card").each(function (index, element) {
        let randomIndex = Math.floor(Math.random() * $(".card").length)
        $(element).insertAfter($(".card")[randomIndex])
    })
}


function setup() {
    // set up the timer
    let timer = setInterval(() => {
        $(".timer").text(parseInt($(".timer").text()) - 1)
        if (parseInt($(".timer").text()) == 10) {
            $(".timer").css("color", "red")
            $(".timer").css("font-size", "5em")
        } else if (parseInt($(".timer").text()) == 0) {
            alert("You lose!")
            clearInterval(timer)
            // reload page
            location.reload()
        }
    }, 1000)

    // Let user start the game
    $(".start").on("click", function () {
        let difficulty = $(".difficulty").val()
        let timer = difficulty == "easy" ? 15 : difficulty == "medium" ? 30 : 40

        if (difficulty == "easy") {
            if ($(".game").hasClass("game-medium")) {
                $(".game").toggleClass("game-medium")
            } else if ($(".game").hasClass("game-hard")) {
                $(".game").toggleClass("game-hard")
            } else if ($(".game").hasClass("game-easy")) {
                $(".game").toggleClass("game-easy")
            }
            $(".game").toggleClass("game-easy")
            $(".game").empty()
            $(".game").append(`
            <div class="card">
            <img id="img1" class="front_face" src="/images/1.png" alt="">
            <img  class="back_face"  src="/images/back.png" alt="">
        </div>

        <div class="card">
            <img id="img2"  class="front_face" src="/images/2.png" alt="">
            <img  class="back_face" src="/images/back.png" alt="">
        </div>

        <div class="card">
            <img  id="img3" class="front_face" src="/images/3.png" alt="">
            <img  class="back_face" src="/images/back.png" alt="">
        </div>

        <div class="card">
            <img  id="img4"  class="front_face" src="/images/1.png" alt="">
            <img  class="back_face" src="/images/back.png" alt="">
        </div>

        <div class="card">
            <img  id="img5"  class="front_face" src="/images/2.png" alt="">
            <img  class="back_face" src="/images/back.png" alt="">
        </div>

        <div class="card">
            <img  id="img6" class="front_face" src="/images/3.png" alt="">
            <img class="back_face" src="/images/back.png" alt="">
        </div>
        `)
        } else if (difficulty == "medium") {
            $(".game").empty()
            if ($(".game").hasClass("game-medium")) {
                $(".game").toggleClass("game-medium")
            } else if ($(".game").hasClass("game-hard")) {
                $(".game").toggleClass("game-hard")
            } else if ($(".game").hasClass("game-easy")) {
                $(".game").toggleClass("game-easy")
            }
            $(".game").toggleClass("game-medium")
            $(".game").append(`

            <div class="card">
            <img id="img1" class="front_face" src="/images/1.png" alt="">
            <img  class="back_face"  src="/images/back.png" alt="">
        </div>

        <div class="card">
            <img id="img2"  class="front_face" src="/images/2.png" alt="">
            <img  class="back_face" src="/images/back.png" alt="">
        </div>

        <div class="card">
            <img  id="img3" class="front_face" src="/images/3.png" alt="">
            <img  class="back_face" src="/images/back.png" alt="">
        </div>

        <div class="card">
            <img  id="img4"  class="front_face" src="/images/4.png" alt="">
            <img  class="back_face" src="/images/back.png" alt="">
        </div>

        <div class="card">
            <img  id="img5"  class="front_face" src="/images/5.png" alt="">
            <img  class="back_face" src="/images/back.png" alt="">
        </div>

        <div class="card">
            <img  id="img6" class="front_face" src="/images/6.png" alt="">
            <img class="back_face" src="/images/back.png" alt="">
        </div>

        <div class="card">
        <img id="img7" class="front_face" src="/images/1.png" alt="">
        <img  class="back_face"  src="/images/back.png" alt="">
    </div>
    <div class="card">
        <img id="img8"  class="front_face" src="/images/2.png" alt="">
        <img  class="back_face" src="/images/back.png" alt="">
    </div>

    <div class="card">
        <img  id="img9" class="front_face" src="/images/3.png" alt="">
        <img  class="back_face" src="/images/back.png" alt="">
    </div>

    <div class="card">
        <img  id="img10"  class="front_face" src="/images/4.png" alt="">
        <img  class="back_face" src="/images/back.png" alt="">
    </div>

    <div class="card">
        <img  id="img11"  class="front_face" src="/images/5.png" alt="">
        <img  class="back_face" src="/images/back.png" alt="">
    </div>

    <div class="card">
        <img  id="img12" class="front_face" src="/images/6.png" alt="">
        <img class="back_face" src="/images/back.png" alt="">
    </div>
    <div class="card">
        <img  id="img13"  class="front_face" src="/images/5.png" alt="">
        <img  class="back_face" src="/images/back.png" alt="">
    </div>

    <div class="card">
        <img  id="img14" class="front_face" src="/images/6.png" alt="">
        <img class="back_face" src="/images/back.png" alt="">
    </div>
    <div class="card">
        <img  id="img15" class="front_face" src="/images/6.png" alt="">
        <img class="back_face" src="/images/back.png" alt="">
    </div>
    <div class="card">
        <img  id="img15" class="front_face" src="/images/6.png" alt="">
        <img class="back_face" src="/images/back.png" alt="">
            </div>`)
    // change game size
    } else if (difficulty == "hard") {
        $(".game").empty()
        if ($(".game").hasClass("game-medium")) {
            $(".game").toggleClass("game-medium")
        } else if ($(".game").hasClass("game-hard")) {
            $(".game").toggleClass("game-hard")
        } else if ($(".game").hasClass("game-easy")) {
            $(".game").toggleClass("game-easy")
        }

        $(".game").toggleClass("game-hard")

        $
        $(".game").append(`
        <div class="card">
            <img id="img1" class="front_face" src="/images/1.png" alt="">
            <img  class="back_face"  src="/images/back.png" alt="">
        </div>

        <div class="card">
            <img id="img2"  class="front_face" src="/images/2.png" alt="">
            <img  class="back_face" src="/images/back.png" alt="">
        </div>

        <div class="card">
            <img  id="img3" class="front_face" src="/images/3.png" alt="">
            <img  class="back_face" src="/images/back.png" alt="">
        </div>

        <div class="card">
            <img  id="img4"  class="front_face" src="/images/4.png" alt="">
            <img  class="back_face" src="/images/back.png" alt="">
        </div>

        <div class="card">
            <img  id="img5"  class="front_face" src="/images/5.png" alt="">
            <img  class="back_face" src="/images/back.png" alt="">
        </div>

        <div class="card">
            <img  id="img6" class="front_face" src="/images/6.png" alt="">
            <img class="back_face" src="/images/back.png" alt="">
        </div>

        <div class="card">
            <img id="img7" class="front_face" src="/images/7.png" alt="">
            <img  class="back_face"  src="/images/back.png" alt="">
        </div>

        <div class="card">
            <img id="img8"  class="front_face" src="/images/8.png" alt="">
            <img  class="back_face" src="/images/back.png" alt="">
        </div>

        <div class="card">
            <img  id="img9" class="front_face" src="/images/9.png" alt="">
            <img  class="back_face" src="/images/back.png" alt="">
        </div>

        <div class="card">
            <img  id="img10"  class="front_face" src="/images/10.png" alt="">
            <img  class="back_face" src="/images/back.png" alt="">
        </div>
        
        <div class="card">
        <img id="img11" class="front_face" src="/images/1.png" alt="">
        <img  class="back_face"  src="/images/back.png" alt="">
    </div>

    <div class="card">
        <img id="img12"  class="front_face" src="/images/2.png" alt="">
        <img  class="back_face" src="/images/back.png" alt="">
    </div>

    <div class="card">
        <img  id="img13" class="front_face" src="/images/3.png" alt="">
        <img  class="back_face" src="/images/back.png" alt="">
    </div>

    <div class="card">
        <img  id="img14"  class="front_face" src="/images/4.png" alt="">
        <img  class="back_face" src="/images/back.png" alt="">
    </div>

    <div class="card">
        <img  id="img15"  class="front_face" src="/images/5.png" alt="">
        <img  class="back_face" src="/images/back.png" alt="">
    </div>

    <div class="card">
        <img  id="img16" class="front_face" src="/images/6.png" alt="">
        <img class="back_face" src="/images/back.png" alt="">
    </div>

    <div class="card">
        <img id="img17" class="front_face" src="/images/7.png" alt="">
        <img  class="back_face"  src="/images/back.png" alt="">
    </div>
    
    <div class="card">
        <img id="img18"  class="front_face" src="/images/8.png" alt="">
        <img  class="back_face" src="/images/back.png" alt="">
    </div>

    <div class="card">
        <img  id="img19" class="front_face" src="/images/9.png" alt="">
        <img  class="back_face" src="/images/back.png" alt="">
    </div>

    <div class="card">
        <img  id="img20"  class="front_face" src="/images/10.png" alt="">
        <img  class="back_face" src="/images/back.png" alt="">
    </div>
    `)
    }       
        // Start timer
         $(".timer").text(timer)
         // shuffle cards
        $(".card").each(function (index, element) {
            let randomIndex = Math.floor(Math.random() * $(".card").length)
            $(element).insertAfter($(".card")[randomIndex])
        })

     $(".card").on("click", function () {
        if(lockBoard) return;
        if(this === firstCard) return;
        $(this).toggleClass("flip")


        if (!firstCardHasBeenFlipped) {
            // the first card
            firstCard = $(this).find(".front_face")[0]
            // console.log(firstCard);
            firstCardHasBeenFlipped = true
        } else {
            // this is the 2nd card
            secondCard = $(this).find(".front_face")[0]
            firstCardHasBeenFlipped = false
            console.log(firstCard, secondCard);
            // prevernt user from double clicking
            // check if the 2 cards match
     
            // ccheck if we have match!
            if ($(`#${firstCard.id}`).attr("src") == $(`#${secondCard.id}`).attr("src")) {
                console.log("a match!");
                // update the game state
                // disable clicking events on these cards
                $(`#${firstCard.id}`).parent().off("click")
                $(`#${secondCard.id}`).parent().off("click")
            } else {
                lockBoard = true
                console.log("not a match");
                // unflipping
                setTimeout(() => {
                    $(`#${firstCard.id}`).parent().removeClass("flip")
                    $(`#${secondCard.id}`).parent().removeClass("flip")
                    lockBoard = false
                }, 1000)
            }
            if ($(".card:not(.flip)").length == 0) {
                alert("you win!")
                clearInterval(timer)
                let score = $(".timer").text() * 10
                $.ajax({
                    url: " https://desolate-refuge-07915.herokuapp.com/api/game",
                    method: "put",
                    data: {
                        level: difficulty,
                        score: score,
                        wins: new Date(),
                    }
                })
                    .then(function (response) {
                        console.log(response);
                        location.reload();
                    }
                    )
                    
            }
        }
    })
    })


    $(".card").each(function (index, element) {
        let randomIndex = Math.floor(Math.random() * $(".card").length)
        $(element).insertAfter($(".card")[randomIndex])
    })
}

$(document).ready(setup)