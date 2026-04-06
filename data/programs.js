const programs = {
  fat_loss: {
    id: 'fat_loss',
    name: 'Fat Loss',
    emoji: '🔥',
    description: 'Burn fat with cardio + strength',
    durationWeeks: 12,
    defaultDaysPerWeek: 3,
    phases: [
      {
        name: 'Foundation',
        weeks: [1, 2, 3, 4],
        days: [
          {
            name: 'Full Body A',
            exercises: [
              { id: 'bodyweight_squat', sets: 3, reps: 15 },
              { id: 'pushup', sets: 3, reps: 10 },
              { id: 'mountain_climber', sets: 3, reps: 20 },
              { id: 'burpee', sets: 3, reps: 5 },
            ],
          },
          {
            name: 'Full Body B',
            exercises: [
              { id: 'reverse_lunge', sets: 3, reps: 12 },
              { id: 'inverted_row', sets: 3, reps: 8 },
              { id: 'plank', sets: 3, reps: 30, isHold: true },
              { id: 'high_knees', sets: 3, reps: 30, isHold: true },
            ],
          },
          {
            name: 'Full Body C',
            exercises: [
              { id: 'glute_bridge', sets: 3, reps: 15 },
              { id: 'wide_pushup', sets: 3, reps: 10 },
              { id: 'bicycle_crunch', sets: 3, reps: 15 },
              { id: 'jump_squat', sets: 3, reps: 8 },
            ],
          },
        ],
      },
      {
        name: 'Progression',
        weeks: [5, 6, 7, 8],
        days: [
          {
            name: 'Burn A',
            exercises: [
              { id: 'jump_squat', sets: 4, reps: 12 },
              { id: 'diamond_pushup', sets: 3, reps: 12 },
              { id: 'mountain_climber', sets: 4, reps: 30 },
              { id: 'burpee', sets: 3, reps: 10 },
            ],
          },
          {
            name: 'Burn B',
            exercises: [
              { id: 'bulgarian_split_squat', sets: 3, reps: 10 },
              { id: 'inverted_row', sets: 4, reps: 12 },
              { id: 'side_plank', sets: 3, reps: 30, isHold: true },
              { id: 'star_jump', sets: 3, reps: 15 },
            ],
          },
          {
            name: 'Burn C',
            exercises: [
              { id: 'single_leg_glute_bridge', sets: 3, reps: 12 },
              { id: 'pike_pushup', sets: 3, reps: 10 },
              { id: 'russian_twist', sets: 4, reps: 20 },
              { id: 'high_knees', sets: 4, reps: 40, isHold: true },
            ],
          },
        ],
      },
      {
        name: 'Advanced HIIT',
        weeks: [9, 10, 11, 12],
        days: [
          {
            name: 'HIIT Circuit A',
            exercises: [
              { id: 'burpee', sets: 4, reps: 12 },
              { id: 'jump_squat', sets: 4, reps: 15 },
              { id: 'mountain_climber', sets: 4, reps: 40 },
              { id: 'archer_pushup', sets: 3, reps: 8 },
              { id: 'flutter_kick', sets: 3, reps: 30 },
            ],
          },
          {
            name: 'HIIT Circuit B',
            exercises: [
              { id: 'star_jump', sets: 4, reps: 20 },
              { id: 'bulgarian_split_squat', sets: 4, reps: 12 },
              { id: 'decline_pushup', sets: 3, reps: 12 },
              { id: 'bicycle_crunch', sets: 4, reps: 25 },
              { id: 'lateral_shuffle', sets: 3, reps: 20 },
            ],
          },
          {
            name: 'HIIT Circuit C',
            exercises: [
              { id: 'high_knees', sets: 4, reps: 45, isHold: true },
              { id: 'diamond_pushup', sets: 4, reps: 15 },
              { id: 'jump_squat', sets: 4, reps: 15 },
              { id: 'leg_raise', sets: 4, reps: 15 },
              { id: 'burpee', sets: 3, reps: 15 },
            ],
          },
        ],
      },
    ],
  },

  muscle_gain: {
    id: 'muscle_gain',
    name: 'Muscle Gain',
    emoji: '💪',
    description: 'Build strength progressively',
    durationWeeks: 12,
    defaultDaysPerWeek: 4,
    phases: [
      {
        name: 'Foundation',
        weeks: [1, 2, 3, 4],
        days: [
          {
            name: 'Push Day',
            exercises: [
              { id: 'pushup', sets: 4, reps: 12 },
              { id: 'pike_pushup', sets: 3, reps: 10 },
              { id: 'diamond_pushup', sets: 3, reps: 8 },
              { id: 'dip', sets: 3, reps: 10 },
            ],
          },
          {
            name: 'Pull Day',
            exercises: [
              { id: 'inverted_row', sets: 4, reps: 10 },
              { id: 'superman_hold', sets: 3, reps: 15 },
              { id: 'reverse_snow_angel', sets: 3, reps: 12 },
              { id: 'dead_bug', sets: 3, reps: 10 },
            ],
          },
          {
            name: 'Leg Day',
            exercises: [
              { id: 'bodyweight_squat', sets: 4, reps: 15 },
              { id: 'bulgarian_split_squat', sets: 3, reps: 10 },
              { id: 'glute_bridge', sets: 3, reps: 20 },
              { id: 'calf_raise', sets: 4, reps: 20 },
            ],
          },
          {
            name: 'Core Day',
            exercises: [
              { id: 'plank', sets: 4, reps: 45, isHold: true },
              { id: 'side_plank', sets: 3, reps: 30, isHold: true },
              { id: 'l_sit_hold', sets: 3, reps: 10, isHold: true },
              { id: 'dragon_flag', sets: 3, reps: 5 },
            ],
          },
        ],
      },
      {
        name: 'Growth',
        weeks: [5, 6, 7, 8],
        days: [
          {
            name: 'Push Day',
            exercises: [
              { id: 'decline_pushup', sets: 4, reps: 15 },
              { id: 'pike_pushup', sets: 4, reps: 12 },
              { id: 'diamond_pushup', sets: 4, reps: 12 },
              { id: 'wide_pushup', sets: 3, reps: 15 },
              { id: 'dip', sets: 4, reps: 12 },
            ],
          },
          {
            name: 'Pull Day',
            exercises: [
              { id: 'inverted_row', sets: 4, reps: 15 },
              { id: 'superman_hold', sets: 4, reps: 20 },
              { id: 'reverse_snow_angel', sets: 4, reps: 15 },
              { id: 'door_frame_row', sets: 3, reps: 12 },
            ],
          },
          {
            name: 'Leg Day',
            exercises: [
              { id: 'jump_squat', sets: 4, reps: 12 },
              { id: 'bulgarian_split_squat', sets: 4, reps: 12 },
              { id: 'single_leg_glute_bridge', sets: 3, reps: 15 },
              { id: 'wall_sit', sets: 3, reps: 60, isHold: true },
              { id: 'calf_raise', sets: 4, reps: 25 },
            ],
          },
          {
            name: 'Core Day',
            exercises: [
              { id: 'plank', sets: 4, reps: 60, isHold: true },
              { id: 'side_plank', sets: 3, reps: 45, isHold: true },
              { id: 'leg_raise', sets: 4, reps: 15 },
              { id: 'russian_twist', sets: 4, reps: 20 },
              { id: 'dragon_flag', sets: 3, reps: 8 },
            ],
          },
        ],
      },
      {
        name: 'Peak',
        weeks: [9, 10, 11, 12],
        days: [
          {
            name: 'Push Day',
            exercises: [
              { id: 'archer_pushup', sets: 4, reps: 8 },
              { id: 'decline_pushup', sets: 4, reps: 15 },
              { id: 'pike_pushup', sets: 4, reps: 15 },
              { id: 'diamond_pushup', sets: 4, reps: 15 },
              { id: 'dip', sets: 4, reps: 15 },
            ],
          },
          {
            name: 'Pull Day',
            exercises: [
              { id: 'inverted_row', sets: 5, reps: 15 },
              { id: 'superman_hold', sets: 4, reps: 25 },
              { id: 'reverse_snow_angel', sets: 4, reps: 20 },
              { id: 'door_frame_row', sets: 4, reps: 15 },
            ],
          },
          {
            name: 'Leg Day',
            exercises: [
              { id: 'jump_squat', sets: 5, reps: 15 },
              { id: 'bulgarian_split_squat', sets: 4, reps: 15 },
              { id: 'single_leg_glute_bridge', sets: 4, reps: 15 },
              { id: 'wall_sit', sets: 4, reps: 90, isHold: true },
              { id: 'calf_raise', sets: 5, reps: 30 },
            ],
          },
          {
            name: 'Core Day',
            exercises: [
              { id: 'plank', sets: 4, reps: 90, isHold: true },
              { id: 'side_plank', sets: 4, reps: 60, isHold: true },
              { id: 'l_sit_hold', sets: 4, reps: 20, isHold: true },
              { id: 'dragon_flag', sets: 4, reps: 10 },
              { id: 'flutter_kick', sets: 4, reps: 30 },
            ],
          },
        ],
      },
    ],
  },

  flexibility: {
    id: 'flexibility',
    name: 'Flexibility',
    emoji: '🧘',
    description: 'Improve posture and mobility',
    durationWeeks: 4,
    defaultDaysPerWeek: 5,
    phases: [
      {
        name: '30-Day Challenge',
        weeks: [1, 2, 3, 4],
        days: [
          {
            name: 'Morning Flow',
            exercises: [
              { id: 'cat_cow', sets: 1, reps: 10 },
              { id: 'hip_circle', sets: 1, reps: 10 },
              { id: 'thoracic_rotation', sets: 1, reps: 10 },
              { id: 'forward_fold', sets: 1, reps: 30, isHold: true },
              { id: 'hip_flexor_stretch', sets: 1, reps: 30, isHold: true },
              { id: 'shoulder_cross_body', sets: 1, reps: 30, isHold: true },
              { id: 'neck_roll', sets: 1, reps: 10 },
            ],
          },
          {
            name: 'Evening Stretch',
            exercises: [
              { id: 'pigeon_pose', sets: 1, reps: 60, isHold: true },
              { id: 'seated_forward_fold', sets: 1, reps: 60, isHold: true },
              { id: 'butterfly_stretch', sets: 1, reps: 60, isHold: true },
              { id: 'chest_stretch', sets: 1, reps: 45, isHold: true },
              { id: 'child_pose', sets: 1, reps: 60, isHold: true },
            ],
          },
          {
            name: 'Full Body Mobility',
            exercises: [
              { id: 'cat_cow', sets: 2, reps: 10 },
              { id: 'hip_circle', sets: 2, reps: 10 },
              { id: 'thoracic_rotation', sets: 2, reps: 10 },
              { id: 'pigeon_pose', sets: 1, reps: 45, isHold: true },
              { id: 'hip_flexor_stretch', sets: 1, reps: 45, isHold: true },
              { id: 'child_pose', sets: 1, reps: 45, isHold: true },
            ],
          },
          {
            name: 'Upper Body Focus',
            exercises: [
              { id: 'neck_roll', sets: 2, reps: 10 },
              { id: 'shoulder_cross_body', sets: 2, reps: 30, isHold: true },
              { id: 'chest_stretch', sets: 2, reps: 30, isHold: true },
              { id: 'thoracic_rotation', sets: 2, reps: 12 },
              { id: 'cat_cow', sets: 2, reps: 10 },
              { id: 'child_pose', sets: 1, reps: 60, isHold: true },
            ],
          },
          {
            name: 'Lower Body Focus',
            exercises: [
              { id: 'hip_circle', sets: 2, reps: 10 },
              { id: 'hip_flexor_stretch', sets: 2, reps: 45, isHold: true },
              { id: 'pigeon_pose', sets: 2, reps: 45, isHold: true },
              { id: 'seated_forward_fold', sets: 2, reps: 45, isHold: true },
              { id: 'butterfly_stretch', sets: 2, reps: 45, isHold: true },
              { id: 'forward_fold', sets: 1, reps: 45, isHold: true },
            ],
          },
        ],
      },
    ],
  },

  stamina: {
    id: 'stamina',
    name: 'Stamina',
    emoji: '🏃',
    description: 'Build endurance and energy',
    durationWeeks: 8,
    defaultDaysPerWeek: 3,
    phases: [
      {
        name: '20s On / 40s Rest',
        weeks: [1, 2],
        days: [
          {
            name: 'HIIT A',
            exercises: [
              { id: 'jumping_jack', sets: 4, reps: 20, isHold: true },
              { id: 'high_knees', sets: 4, reps: 20, isHold: true },
              { id: 'burpee', sets: 4, reps: 5 },
              { id: 'mountain_climber', sets: 4, reps: 20, isHold: true },
            ],
          },
          {
            name: 'HIIT B',
            exercises: [
              { id: 'high_knees', sets: 4, reps: 20, isHold: true },
              { id: 'squat_jump', sets: 4, reps: 8 },
              { id: 'jumping_jack', sets: 4, reps: 20, isHold: true },
              { id: 'mountain_climber', sets: 4, reps: 20, isHold: true },
            ],
          },
          {
            name: 'HIIT C',
            exercises: [
              { id: 'burpee', sets: 4, reps: 5 },
              { id: 'jumping_jack', sets: 4, reps: 20, isHold: true },
              { id: 'high_knees', sets: 4, reps: 20, isHold: true },
              { id: 'lateral_shuffle', sets: 4, reps: 20, isHold: true },
            ],
          },
        ],
      },
      {
        name: '30s On / 30s Rest',
        weeks: [3, 4],
        days: [
          {
            name: 'Endurance A',
            exercises: [
              { id: 'jumping_jack', sets: 5, reps: 30, isHold: true },
              { id: 'high_knees', sets: 5, reps: 30, isHold: true },
              { id: 'squat_jump', sets: 5, reps: 10 },
              { id: 'burpee', sets: 5, reps: 8 },
              { id: 'lateral_shuffle', sets: 5, reps: 30, isHold: true },
            ],
          },
          {
            name: 'Endurance B',
            exercises: [
              { id: 'mountain_climber', sets: 5, reps: 30, isHold: true },
              { id: 'star_jump', sets: 5, reps: 12 },
              { id: 'high_knees', sets: 5, reps: 30, isHold: true },
              { id: 'burpee', sets: 5, reps: 8 },
              { id: 'jump_rope', sets: 5, reps: 30, isHold: true },
            ],
          },
          {
            name: 'Endurance C',
            exercises: [
              { id: 'squat_jump', sets: 5, reps: 12 },
              { id: 'jumping_jack', sets: 5, reps: 30, isHold: true },
              { id: 'lateral_shuffle', sets: 5, reps: 30, isHold: true },
              { id: 'mountain_climber', sets: 5, reps: 30, isHold: true },
              { id: 'high_knees', sets: 5, reps: 30, isHold: true },
            ],
          },
        ],
      },
      {
        name: '40s On / 20s Rest',
        weeks: [5, 6],
        days: [
          {
            name: 'Power A',
            exercises: [
              { id: 'burpee', sets: 5, reps: 12 },
              { id: 'jump_squat', sets: 5, reps: 15 },
              { id: 'mountain_climber', sets: 5, reps: 40, isHold: true },
              { id: 'star_jump', sets: 5, reps: 15 },
              { id: 'high_knees', sets: 5, reps: 40, isHold: true },
              { id: 'lateral_shuffle', sets: 5, reps: 40, isHold: true },
            ],
          },
          {
            name: 'Power B',
            exercises: [
              { id: 'jumping_jack', sets: 5, reps: 40, isHold: true },
              { id: 'squat_jump', sets: 5, reps: 15 },
              { id: 'burpee', sets: 5, reps: 12 },
              { id: 'jump_rope', sets: 5, reps: 40, isHold: true },
              { id: 'mountain_climber', sets: 5, reps: 40, isHold: true },
              { id: 'star_jump', sets: 5, reps: 15 },
            ],
          },
          {
            name: 'Power C',
            exercises: [
              { id: 'high_knees', sets: 5, reps: 40, isHold: true },
              { id: 'lateral_shuffle', sets: 5, reps: 40, isHold: true },
              { id: 'burpee', sets: 5, reps: 12 },
              { id: 'jumping_jack', sets: 5, reps: 40, isHold: true },
              { id: 'jump_squat', sets: 5, reps: 15 },
              { id: 'mountain_climber', sets: 5, reps: 40, isHold: true },
            ],
          },
        ],
      },
      {
        name: 'Tabata',
        weeks: [7, 8],
        days: [
          {
            name: 'Tabata A',
            exercises: [
              { id: 'burpee', sets: 8, reps: 6 },
              { id: 'squat_jump', sets: 8, reps: 8 },
              { id: 'mountain_climber', sets: 8, reps: 15 },
              { id: 'high_knees', sets: 8, reps: 20, isHold: true },
            ],
          },
          {
            name: 'Tabata B',
            exercises: [
              { id: 'star_jump', sets: 8, reps: 8 },
              { id: 'jumping_jack', sets: 8, reps: 20, isHold: true },
              { id: 'lateral_shuffle', sets: 8, reps: 20, isHold: true },
              { id: 'burpee', sets: 8, reps: 6 },
            ],
          },
          {
            name: 'Tabata C',
            exercises: [
              { id: 'jump_squat', sets: 8, reps: 10 },
              { id: 'high_knees', sets: 8, reps: 20, isHold: true },
              { id: 'mountain_climber', sets: 8, reps: 15 },
              { id: 'star_jump', sets: 8, reps: 8 },
            ],
          },
        ],
      },
    ],
  },

  beginner: {
    id: 'beginner',
    name: 'Beginner',
    emoji: '🌱',
    description: 'Start from zero, no experience',
    durationWeeks: 6,
    defaultDaysPerWeek: 3,
    phases: [
      {
        name: 'Week 1',
        weeks: [1],
        days: [
          {
            name: 'Gentle Start A',
            exercises: [
              { id: 'wall_pushup', sets: 2, reps: 5 },
              { id: 'chair_squat', sets: 2, reps: 8 },
              { id: 'knee_plank', sets: 2, reps: 15, isHold: true },
            ],
          },
          {
            name: 'Gentle Start B',
            exercises: [
              { id: 'wall_pushup', sets: 2, reps: 5 },
              { id: 'glute_bridge', sets: 2, reps: 8 },
              { id: 'dead_bug', sets: 2, reps: 6 },
            ],
          },
          {
            name: 'Gentle Start C',
            exercises: [
              { id: 'chair_squat', sets: 2, reps: 8 },
              { id: 'wall_pushup', sets: 2, reps: 5 },
              { id: 'knee_plank', sets: 2, reps: 15, isHold: true },
            ],
          },
        ],
      },
      {
        name: 'Week 2',
        weeks: [2],
        days: [
          {
            name: 'Building A',
            exercises: [
              { id: 'knee_pushup', sets: 2, reps: 8 },
              { id: 'bodyweight_squat', sets: 2, reps: 10 },
              { id: 'plank', sets: 2, reps: 20, isHold: true },
            ],
          },
          {
            name: 'Building B',
            exercises: [
              { id: 'knee_pushup', sets: 2, reps: 8 },
              { id: 'glute_bridge', sets: 2, reps: 12 },
              { id: 'dead_bug', sets: 2, reps: 8 },
            ],
          },
          {
            name: 'Building C',
            exercises: [
              { id: 'bodyweight_squat', sets: 2, reps: 10 },
              { id: 'knee_pushup', sets: 2, reps: 8 },
              { id: 'plank', sets: 2, reps: 20, isHold: true },
            ],
          },
        ],
      },
      {
        name: 'Week 3',
        weeks: [3],
        days: [
          {
            name: 'Growing A',
            exercises: [
              { id: 'pushup', sets: 2, reps: 5 },
              { id: 'bodyweight_squat', sets: 2, reps: 12 },
              { id: 'plank', sets: 2, reps: 30, isHold: true },
              { id: 'glute_bridge', sets: 2, reps: 10 },
            ],
          },
          {
            name: 'Growing B',
            exercises: [
              { id: 'pushup', sets: 2, reps: 5 },
              { id: 'reverse_lunge', sets: 2, reps: 8 },
              { id: 'dead_bug', sets: 2, reps: 10 },
              { id: 'glute_bridge', sets: 2, reps: 10 },
            ],
          },
          {
            name: 'Growing C',
            exercises: [
              { id: 'bodyweight_squat', sets: 2, reps: 12 },
              { id: 'pushup', sets: 2, reps: 5 },
              { id: 'plank', sets: 2, reps: 30, isHold: true },
              { id: 'mountain_climber', sets: 2, reps: 10 },
            ],
          },
        ],
      },
      {
        name: 'Week 4',
        weeks: [4],
        days: [
          {
            name: 'Stronger A',
            exercises: [
              { id: 'pushup', sets: 3, reps: 8 },
              { id: 'bodyweight_squat', sets: 3, reps: 12 },
              { id: 'plank', sets: 3, reps: 30, isHold: true },
              { id: 'reverse_lunge', sets: 2, reps: 8 },
            ],
          },
          {
            name: 'Stronger B',
            exercises: [
              { id: 'pushup', sets: 3, reps: 8 },
              { id: 'glute_bridge', sets: 3, reps: 15 },
              { id: 'bicycle_crunch', sets: 2, reps: 12 },
              { id: 'reverse_lunge', sets: 2, reps: 8 },
            ],
          },
          {
            name: 'Stronger C',
            exercises: [
              { id: 'bodyweight_squat', sets: 3, reps: 12 },
              { id: 'pushup', sets: 3, reps: 8 },
              { id: 'plank', sets: 3, reps: 30, isHold: true },
              { id: 'mountain_climber', sets: 3, reps: 15 },
            ],
          },
        ],
      },
      {
        name: 'Weeks 5-6',
        weeks: [5, 6],
        days: [
          {
            name: 'Level Up A',
            exercises: [
              { id: 'pushup', sets: 3, reps: 10 },
              { id: 'jump_squat', sets: 2, reps: 5 },
              { id: 'bodyweight_squat', sets: 3, reps: 15 },
              { id: 'plank', sets: 3, reps: 40, isHold: true },
              { id: 'glute_bridge', sets: 3, reps: 15 },
            ],
          },
          {
            name: 'Level Up B',
            exercises: [
              { id: 'wide_pushup', sets: 3, reps: 8 },
              { id: 'reverse_lunge', sets: 3, reps: 10 },
              { id: 'bicycle_crunch', sets: 3, reps: 15 },
              { id: 'high_knees', sets: 2, reps: 20, isHold: true },
              { id: 'superman_hold', sets: 2, reps: 10 },
            ],
          },
          {
            name: 'Level Up C',
            exercises: [
              { id: 'pushup', sets: 3, reps: 12 },
              { id: 'bodyweight_squat', sets: 3, reps: 15 },
              { id: 'mountain_climber', sets: 3, reps: 20 },
              { id: 'side_plank', sets: 2, reps: 20, isHold: true },
              { id: 'jumping_jack', sets: 2, reps: 20 },
            ],
          },
        ],
      },
    ],
  },
};

export const GOAL_TO_PROGRAM = {
  fat_loss: 'fat_loss',
  muscle_gain: 'muscle_gain',
  flexibility: 'flexibility',
  stamina: 'stamina',
  beginner: 'beginner',
};

export const ENCOURAGEMENT_MESSAGES = [
  "You showed up — that's what counts! 💪",
  "Every rep brings you closer to your goal!",
  "Consistency beats perfection. Great work!",
  "Your future self will thank you for today!",
  "That's how champions are made! 🏆",
  "You're stronger than you think!",
  "One more day of progress in the books!",
  "The hardest part was starting. You did it!",
  "Your body is thanking you right now!",
  "Small steps lead to big changes! 🌱",
  "You just outworked yesterday's version of yourself!",
  "Discipline is choosing between what you want now and what you want most.",
  "Rest days are earned. You earned yours!",
  "The only bad workout is the one that didn't happen.",
  "You're building habits that will last a lifetime!",
  "Progress, not perfection! 🎯",
  "Remember why you started. You're doing amazing!",
  "Today's effort is tomorrow's strength!",
  "You're not just working out — you're building character!",
  "Keep this energy going! Unstoppable! 🔥",
  "Sweat is just fat crying. Keep going!",
  "You're in the top 1% of people who actually did something today!",
  "Winners train, losers complain. You're a winner!",
  "Your muscles are growing even as you read this!",
  "That was harder than yesterday, and you still crushed it!",
  "Commitment looks good on you!",
  "One workout closer to your best self!",
  "You just proved that you can do hard things!",
  "The grind is real, and so are your results!",
  "Take a moment to appreciate how far you've come! 🌟",
];

export const MOTIVATIONAL_QUOTES = [
  "The pain you feel today will be the strength you feel tomorrow.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The only person you are destined to become is the person you decide to be.",
  "Believe you can and you're halfway there.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Your body can stand almost anything. It's your mind that you have to convince.",
  "The difference between try and triumph is a little umph.",
  "Strength does not come from physical capacity. It comes from an indomitable will.",
  "The clock is ticking. Are you becoming the person you want to be?",
  "No matter how slow you go, you are still lapping everybody on the couch.",
  "The secret of getting ahead is getting started.",
  "You don't have to be extreme, just consistent.",
  "What seems impossible today will become your warm-up tomorrow.",
  "The best project you'll ever work on is you.",
  "Motivation is what gets you started. Habit is what keeps you going.",
  "Fall seven times, stand up eight.",
  "Be stronger than your excuses.",
  "A champion is someone who gets up when they can't.",
  "Your only limit is your mind.",
  "The hard days are what make you stronger.",
];

export default programs;
