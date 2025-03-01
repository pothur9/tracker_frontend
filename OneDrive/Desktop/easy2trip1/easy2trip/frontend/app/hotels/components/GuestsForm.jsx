import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function GuestsForm({ guests, setGuests }) {
  const updateRooms = (index, key, value) => {
    const updatedRooms = guests.map((room, i) => 
      i === index ? { ...room, [key]: value } : room
    );
    setGuests(updatedRooms);
  };

  const addRoom = () => {
    setGuests([...guests, { adults: 1, children: 0, ChildAge: [] }]);
  };

  const removeRoom = () => {
    if (guests.length > 1) {
      setGuests(guests.slice(0, -1));
    }
  };

  return (
    <div className="space-y-4">
      {/* Rooms */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">Rooms</div>
          <div className="text-sm text-gray-500">Number of rooms needed</div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={removeRoom}
          >
            -
          </Button>
          <span className="w-4 text-center">{guests.length}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={addRoom}
          >
            +
          </Button>
        </div>
      </div>

      {guests.map((room, index) => (
        <div key={index} className="space-y-4">
          <div className="font-medium">Room {index + 1}</div>
          <div className="px-3 flex flex-col gap-3 font-medium">
            {/* Adults */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Adults</div>
                <div className="text-sm text-gray-500">Ages 13 or above</div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    updateRooms(index, 'adults', Math.max(1, room.adults - 1))
                  }
                >
                  -
                </Button>
                <span className="w-4 text-center">{room.adults}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    updateRooms(index, 'adults', room.adults + 1)
                  }
                >
                  +
                </Button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Children</div>
                <div className="text-sm text-gray-500">Ages 0-12</div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    setGuests((prev) => {
                      const newChildren = Math.max(0, room.children - 1);
                      const newChildAge = room.ChildAge.slice(0, newChildren);
                      const updatedRooms = prev.map((r, i) =>
                        i === index ? { ...r, children: newChildren, ChildAge: newChildAge } : r
                      );
                      return updatedRooms;
                    })
                  }
                >
                  -
                </Button>
                <span className="w-4 text-center">{room.children}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    setGuests((prev) => {
                      const newChildren = room.children + 1;
                      const updatedRooms = prev.map((r, i) =>
                        i === index ? { ...r, children: newChildren, ChildAge: [...r.ChildAge, ""] } : r
                      );
                      return updatedRooms;
                    })
                  }
                >
                  +
                </Button>
              </div>
            </div>

            {/* Child Age Inputs */}
            {room.children > 0 && (
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-500">Age of each child</Label>
                {room.ChildAge.map((age, childIndex) => (
                  <Input
                    key={childIndex}
                    type="number"
                    placeholder={`Child ${childIndex + 1} Age`}
                    className="w-full"
                    value={age}
                    onChange={(e) => {
                      const newAges = [...room.ChildAge];
                      newAges[childIndex] = e.target.value;
                      setGuests((prev) => {
                        const updatedRooms = prev.map((r, i) =>
                          i === index ? { ...r, ChildAge: newAges } : r
                        );
                        return updatedRooms;
                      });
                    }}
                    min="0"
                    max="12"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default GuestsForm;