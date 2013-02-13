package working;

public class PersonnalPairValue<T,H> {
	
	T point;
	H pair;
	
	public PersonnalPairValue(T po, H pa){
		point=po;
		pair=pa;
		
	}
	
	public T getPoint(){
		return point;
	}
	
	public H getPair()
	{
		return pair;
	}

	
	public void setPoint(T point){
		this.point=point;
	}
	
	public void setPair(H pair){
		this.pair=pair;
	}
}
