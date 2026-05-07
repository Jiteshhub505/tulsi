import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

type Testimonial = {
  name: string;
  role: string;
  image: string;
  quote: string;
};
const testimonials: Testimonial[] = [
  {
    name: "Aakash Verma",
    role: "Gym Beginner",
    image: "https://randomuser.me/api/portraits/men/61.jpg",
    quote:
      "I started using the weight gainer because I struggled to meet my daily calorie intake. It blends easily, tastes decent, and fits well into my routine when paired with regular workouts and proper meals.",
  },
  {
    name: "Rohan Iyer",
    role: "Fitness Enthusiast",
    image: "https://randomuser.me/api/portraits/men/62.jpg",
    quote:
      "The fat burner works best for me as a supporting supplement. I use it along with cardio and strength training, and it helps me stay more focused during workouts without any extreme effects.",
  },
  {
    name: "Neeraj Singh",
    role: "Working Professional",
    image: "https://randomuser.me/api/portraits/men/63.jpg",
    quote:
      "With a busy work schedule, maintaining proper nutrition is difficult. This weight gainer helps me stay consistent on days when full meals are hard to manage.",
  },
  {
    name: "Simran Kaur",
    role: "Lifestyle Fitness User",
    image: "https://randomuser.me/api/portraits/women/64.jpg",
    quote:
      "I like products that are honest about results. This one supports an active lifestyle when used responsibly with balanced food and regular physical activity.",
  },
  {
    name: "Karthik R",
    role: "Regular Gym Goer",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    quote:
      "The fat burner complements my workout routine. It’s not a shortcut, but when combined with training and discipline, it fits well into my fitness plan.",
  },
  {
    name: "Pankaj Mehta",
    role: "Athlete",
    image: "https://randomuser.me/api/portraits/men/66.jpg",
    quote:
      "I use the weight gainer post-workout to support my nutrition goals. It’s convenient, easy to digest, and helps me stay consistent during intense training phases.",
  },
  {
    name: "Anjali Sharma",
    role: "Active Lifestyle User",
    image: "https://randomuser.me/api/portraits/women/67.jpg",
    quote:
      "I appreciate that the product focuses on supporting a routine rather than promising instant results. It works best when paired with mindful eating and exercise.",
  },
  {
    name: "Mohit Bansal",
    role: "Fitness Hobbyist",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    quote:
      "Simple, clean supplement. It doesn’t claim miracles, but it helps maintain consistency, which is what actually matters in the long run.",
  },
  {
    name: "Ritika Joshi",
    role: "Wellness-Focused User",
    image: "https://randomuser.me/api/portraits/women/69.jpg",
    quote:
      "The fat burner fits nicely into my routine. I use it responsibly along with regular workouts and proper hydration.",
  },
  {
    name: "Saurabh Jain",
    role: "Recreational Athlete",
    image: "https://randomuser.me/api/portraits/men/70.jpg",
    quote:
      "The weight gainer is convenient and easy to include in my daily nutrition plan. It helps me stay on track without feeling heavy.",
  },
  {
    name: "Nikhil Arora",
    role: "Corporate Professional",
    image: "https://randomuser.me/api/portraits/men/71.jpg",
    quote:
      "Long office hours make consistent meals difficult. This product helps bridge the gap when used along with proper food choices.",
  },
  {
    name: "Priya Malhotra",
    role: "Fitness Learner",
    image: "https://randomuser.me/api/portraits/women/72.jpg",
    quote:
      "I am still learning about fitness, and I like that this product supports the journey instead of pushing unrealistic expectations.",
  },
  {
    name: "Abhishek Yadav",
    role: "Gym Regular",
    image: "https://randomuser.me/api/portraits/men/73.jpg",
    quote:
      "Used consistently with training, the weight gainer supports my daily intake goals. No discomfort and easy to manage.",
  },
  {
    name: "Shreya Sen",
    role: "Health-Conscious User",
    image: "https://randomuser.me/api/portraits/women/74.jpg",
    quote:
      "I prefer supplements that encourage balance. This one complements my lifestyle without extreme claims.",
  },
  {
    name: "Varun Kapoor",
    role: "Strength Training User",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    quote:
      "The product fits well into my post-workout routine and supports my nutrition goals when used consistently.",
  },
  {
    name: "Ishita Roy",
    role: "Active Individual",
    image: "https://randomuser.me/api/portraits/women/76.jpg",
    quote:
      "It’s easy to include in daily life. Works best when combined with proper food, hydration, and movement.",
  },
  {
    name: "Harsh Vardhan",
    role: "Beginner Athlete",
    image: "https://randomuser.me/api/portraits/men/77.jpg",
    quote:
      "This helped me build a routine instead of chasing quick results. Consistency feels easier now.",
  },
  {
    name: "Megha Choudhary",
    role: "Wellness User",
    image: "https://randomuser.me/api/portraits/women/78.jpg",
    quote:
      "I value transparency in supplements. This one fits nicely into a balanced, health-focused lifestyle.",
  },
  {
    name: "Ritesh Kulkarni",
    role: "Fitness Explorer",
    image: "https://randomuser.me/api/portraits/men/79.jpg",
    quote:
      "The fat burner supports my workout days when used responsibly. No harsh effects, just steady support.",
  },
  {
    name: "Kavya Nair",
    role: "Lifestyle User",
    image: "https://randomuser.me/api/portraits/women/80.jpg",
    quote:
      "I like that it encourages discipline and consistency rather than shortcuts.",
  },
  {
    name: "Arjun Malhotra",
    role: "Gym Enthusiast",
    image: "https://randomuser.me/api/portraits/men/81.jpg",
    quote:
      "The weight gainer blends smoothly and supports my calorie intake goals alongside training.",
  },
  {
    name: "Neha Jain",
    role: "Health-Oriented User",
    image: "https://randomuser.me/api/portraits/women/82.jpg",
    quote:
      "Used sensibly with diet and exercise, it complements a healthy routine.",
  },
  {
    name: "Siddharth Rao",
    role: "Recreational Fitness User",
    image: "https://randomuser.me/api/portraits/men/83.jpg",
    quote:
      "Overall, a practical supplement that supports consistency and routine building.",
  },
  {
    name: "Pallavi Deshmukh",
    role: "Active Lifestyle Professional",
    image: "https://randomuser.me/api/portraits/women/84.jpg",
    quote:
      "I prefer realistic products. This one fits well into my daily schedule when paired with mindful habits.",
  },
];

const femaleNames = new Set([
  "Simran Kaur",
  "Anjali Sharma",
  "Ritika Joshi",
  "Priya Malhotra",
  "Shreya Sen",
  "Ishita Roy",
  "Megha Choudhary",
  "Kavya Nair",
  "Neha Jain",
  "Pallavi Deshmukh",
]);

const indianMalePhotos = [
  "https://images.unsplash.com/photo-1701615004839-40d91f7eecca?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1590086782792-42dd2350140d?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1566753323558-f4e0952af115?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?auto=format&fit=crop&w=300&q=80",
];

const indianFemalePhotos = [
  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1633432697046-a962a6a16bdb?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1619895862022-09114b41f16f?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1618375531912-867984bdfd87?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1506863530036-1efeddceb993?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80",
];

const chunkArray = (
  array: Testimonial[],
  chunkSize: number
): Testimonial[][] => {
  const result: Testimonial[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

const maleCounter = { value: 0 };
const femaleCounter = { value: 0 };

const testimonialsWithIndianPhotos = testimonials.map((item) => {
  const isFemale = femaleNames.has(item.name);
  const pool = isFemale ? indianFemalePhotos : indianMalePhotos;
  const currentIndex = isFemale ? femaleCounter.value++ : maleCounter.value++;

  return {
    ...item,
    image: pool[currentIndex],
  };
});

const testimonialChunks = chunkArray(
  testimonialsWithIndianPhotos,
  Math.ceil(testimonialsWithIndianPhotos.length / 3)
);

export default function Testimonial() {
  return (
    <section>
      <div className="py-16 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-semibold">
              Trusted by Fitness Enthusiasts
            </h2>
            <p className="mt-6">
              Real feedback from people who’ve made consistency and discipline
              part of their fitness journey.
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
            {testimonialChunks.map((chunk, chunkIndex) => (
              <div key={chunkIndex} className="space-y-3">
                {chunk.map(({ name, role, quote, image }, index) => (
                  <Card
                    className="cursor-pointer hover:scale-120 transition-transform"
                    key={index}
                  >
                    <CardContent className=" grid grid-cols-[auto_1fr] gap-3 pt-6">
                      <Avatar className="size-9">
                        <AvatarImage
                          alt={name}
                          src={image}
                          loading="lazy"
                          width="120"
                          height="120"
                        />
                        <AvatarFallback>ST</AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-medium">{name}</h3>

                        <span className="text-muted-foreground block text-sm tracking-wide">
                          {role}
                        </span>

                        <blockquote className="mt-3">
                          <p className="text-gray-700 dark:text-gray-300">
                            {quote}
                          </p>
                        </blockquote>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
